const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 1, // limit each IP to 1 request per windowMs
  message: { error: 'Too many requests, please try again in 5 seconds' }
});

// Cache for storing generated ideas
const cache = new Map();
const CACHE_TTL = (process.env.CACHE_TTL_SECONDS || 120) * 1000;

// Load offline ideas
const offlineIdeas = require('./offline/ideas.json');

// Utility functions
function generateCacheKey(data) {
  return JSON.stringify({
    age: data.age,
    gender: data.gender,
    occasion: data.occasion,
    budget: data.budget,
    interests: data.interests,
    lang: data.lang
  });
}

function cleanCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}

function getRandomIdeas(lang, count = 5) {
  const ideas = offlineIdeas[lang] || offlineIdeas.ru;
  const shuffled = [...ideas].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function validateInput(data) {
  const { age, gender, occasion, budget, interests, lang } = data;
  
  if (!age || age < 1 || age > 120) {
    return { error: 'Age must be between 1 and 120' };
  }
  
  if (!gender || !['Female', 'Male', 'Other'].includes(gender)) {
    return { error: 'Gender must be Female, Male, or Other' };
  }
  
  if (!occasion || !['Birthday', 'Anniversary', 'New Year', 'Graduation', 'Other'].includes(occasion)) {
    return { error: 'Occasion must be Birthday, Anniversary, New Year, Graduation, or Other' };
  }
  
  if (!budget || budget < 0) {
    return { error: 'Budget must be a positive number' };
  }
  
  if (!interests || interests.trim().length === 0) {
    return { error: 'Interests cannot be empty' };
  }
  
  if (!lang || !['ru', 'en'].includes(lang)) {
    return { error: 'Language must be ru or en' };
  }
  
  return null;
}

function createPrompt(data) {
  const { age, gender, occasion, budget, interests, lang } = data;
  const isRussian = lang === 'ru';
  
  return `SYSTEM:
You are "GiftMaster", an expert gift recommendation assistant. 
Always answer in VALID JSON only; do not include any extra text before or after JSON. 
Language: use ${isRussian ? 'Russian' : 'English'}.

TASK:
Generate EXACTLY 5 gift ideas tailored to:
- Age: ${age}
- Gender: ${gender}
- Occasion: ${occasion}
- Budget: ${budget} KZT (tenge)
- Interests: ${interests}

Output JSON schema (STRICT):
{
  "ideas": [
    {
      "title": "string (<= 7 words)",
      "description": "string (<= 30 words)",
      "why": "string (<= 20 words)",
      "price_hint_kzt": "string (e.g., '12000–18000')",
      "tags": ["string", "string"]
    }
  ],
  "meta": {
    "currency": "KZT",
    "locale": "${isRussian ? 'ru-KZ' : 'en-KZ'}"
  }
}

Rules:
- No introductions, no explanations. JSON ONLY.
- Keep language natural, concise, helpful.
- Ensure the JSON is valid, parsable, and follows the schema exactly.`;
}

function tryParseJSON(text) {
  try {
    // Try to find JSON in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/offline', (req, res) => {
  try {
    const lang = req.query.lang || 'ru';
    const ideas = getRandomIdeas(lang, 5);
    
    res.json({
      ideas,
      meta: {
        source: 'offline',
        model: 'offline',
        currency: 'KZT',
        locale: lang === 'ru' ? 'ru-KZ' : 'en-KZ'
      }
    });
  } catch (error) {
    console.error('Offline ideas error:', error);
    res.status(500).json({ error: 'Failed to load offline ideas' });
  }
});

app.post('/api/generate', limiter, async (req, res) => {
  try {
    // Validate input
    const validationError = validateInput(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const { age, gender, occasion, budget, interests, lang } = req.body;
    
    // Check cache
    const cacheKey = generateCacheKey(req.body);
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }

    // Clean old cache entries
    cleanCache();

    // Prepare Hugging Face request
    const prompt = createPrompt(req.body);
    const hfUrl = `https://api-inference.huggingface.co/models/${process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2'}`;
    
    const response = await fetch(hfUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.8,
          top_p: 0.95,
          return_full_text: false
        }
      }),
      timeout: 20000 // 20 seconds timeout
    });

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }

    const hfData = await response.json();
    let generatedText = '';

    // Parse HF response
    if (Array.isArray(hfData)) {
      generatedText = hfData[0]?.generated_text || '';
    } else if (typeof hfData === 'object') {
      generatedText = hfData.generated_text || hfData[0]?.generated_text || '';
    }

    // Try to parse JSON from response
    let parsedData = tryParseJSON(generatedText);
    
    if (!parsedData || !parsedData.ideas || !Array.isArray(parsedData.ideas)) {
      // Fallback to offline ideas
      const offlineIdeas = getRandomIdeas(lang, 5);
      const result = {
        ideas: offlineIdeas,
        meta: {
          source: 'offline',
          model: process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2',
          currency: 'KZT',
          locale: lang === 'ru' ? 'ru-KZ' : 'en-KZ'
        }
      };
      
      // Cache the result
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return res.json(result);
    }

    // Validate parsed data structure
    if (!parsedData.meta) {
      parsedData.meta = {
        currency: 'KZT',
        locale: lang === 'ru' ? 'ru-KZ' : 'en-KZ'
      };
    }

    const result = {
      ideas: parsedData.ideas.slice(0, 5), // Ensure exactly 5 ideas
      meta: {
        source: 'hf',
        model: process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2',
        currency: 'KZT',
        locale: lang === 'ru' ? 'ru-KZ' : 'en-KZ'
      }
    };

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    res.json(result);

  } catch (error) {
    console.error('Generation error:', error);
    
    // Return offline ideas on any error
    const lang = req.body?.lang || 'ru';
    const offlineIdeas = getRandomIdeas(lang, 5);
    
    res.json({
      ideas: offlineIdeas,
      meta: {
        source: 'offline',
        model: process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2',
        currency: 'KZT',
        locale: lang === 'ru' ? 'ru-KZ' : 'en-KZ'
      }
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`AI Gift Generator Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
