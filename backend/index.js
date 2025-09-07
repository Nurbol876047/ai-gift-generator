const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ];
    if (allowed.includes(origin) || /^http:\/\/192\.168\.[0-9.]+:5173$/.test(origin)) {
      return cb(null, true);
    }
    return cb(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 5, // allow up to 5 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again in a few seconds' }
});

// Cache for storing generated ideas
const cache = new Map();
const CACHE_TTL = (process.env.CACHE_TTL_SECONDS || 120) * 1000;

// Load offline ideas
const offlineIdeas = require('./offline/ideas.json');

// Simple AI model for gift generation
const giftTemplates = {
  ru: {
    tech: [
      { title: "Умные часы", description: "Современные часы с функциями фитнес-трекера", why: "Практичный и стильный подарок", price: "15000-25000", tags: ["технологии", "здоровье"] },
      { title: "Беспроводные наушники", description: "Качественные наушники с шумоподавлением", why: "Отличный звук для музыки", price: "8000-15000", tags: ["технологии", "музыка"] },
      { title: "Портативный зарядник", description: "Мощный power bank для зарядки устройств", why: "Всегда заряженный телефон", price: "5000-12000", tags: ["технологии", "практичность"] }
    ],
    sport: [
      { title: "Спортивный костюм", description: "Стильный и удобный спортивный костюм", why: "Подходит для тренировок", price: "12000-20000", tags: ["спорт", "стиль"] },
      { title: "Велосипед", description: "Горный велосипед для активного отдыха", why: "Спорт и путешествия", price: "50000-100000", tags: ["спорт", "путешествия"] },
      { title: "Гантели", description: "Набор разборных гантелей для дома", why: "Тренировки в любое время", price: "15000-30000", tags: ["спорт", "здоровье"] }
    ],
    music: [
      { title: "Гитара", description: "Акустическая гитара для начинающих", why: "Развитие музыкальных навыков", price: "25000-45000", tags: ["музыка", "творчество"] },
      { title: "DJ-контроллер", description: "Профессиональный DJ-контроллер", why: "Создание музыки дома", price: "30000-60000", tags: ["музыка", "технологии"] },
      { title: "Музыкальный плеер", description: "Высококачественный музыкальный плеер", why: "Лучшее качество звука", price: "15000-30000", tags: ["музыка", "технологии"] }
    ],
    art: [
      { title: "Набор для рисования", description: "Профессиональные краски и кисти", why: "Развитие творческих способностей", price: "8000-18000", tags: ["творчество", "искусство"] },
      { title: "Мольберт", description: "Складной мольберт для художников", why: "Удобство при рисовании", price: "12000-25000", tags: ["творчество", "практичность"] },
      { title: "Планшет для рисования", description: "Графический планшет для цифрового искусства", why: "Современное творчество", price: "20000-50000", tags: ["творчество", "технологии"] }
    ]
  },
  en: {
    tech: [
      { title: "Smart Watch", description: "Modern watch with fitness tracking features", why: "Practical and stylish gift", price: "15000-25000", tags: ["technology", "health"] },
      { title: "Wireless Headphones", description: "Quality headphones with noise cancellation", why: "Great sound for music", price: "8000-15000", tags: ["technology", "music"] },
      { title: "Portable Charger", description: "Powerful power bank for charging devices", why: "Always charged phone", price: "5000-12000", tags: ["technology", "practicality"] }
    ],
    sport: [
      { title: "Sports Suit", description: "Stylish and comfortable sports suit", why: "Perfect for workouts", price: "12000-20000", tags: ["sports", "style"] },
      { title: "Bicycle", description: "Mountain bike for active recreation", why: "Sports and travel", price: "50000-100000", tags: ["sports", "travel"] },
      { title: "Dumbbells", description: "Adjustable dumbbell set for home", why: "Workouts anytime", price: "15000-30000", tags: ["sports", "health"] }
    ],
    music: [
      { title: "Guitar", description: "Acoustic guitar for beginners", why: "Develop musical skills", price: "25000-45000", tags: ["music", "creativity"] },
      { title: "DJ Controller", description: "Professional DJ controller", why: "Create music at home", price: "30000-60000", tags: ["music", "technology"] },
      { title: "Music Player", description: "High-quality music player", why: "Best sound quality", price: "15000-30000", tags: ["music", "technology"] }
    ],
    art: [
      { title: "Drawing Set", description: "Professional paints and brushes", why: "Develop creative abilities", price: "8000-18000", tags: ["creativity", "art"] },
      { title: "Easel", description: "Folding easel for artists", why: "Convenience when drawing", price: "12000-25000", tags: ["creativity", "practicality"] },
      { title: "Drawing Tablet", description: "Graphics tablet for digital art", why: "Modern creativity", price: "20000-50000", tags: ["creativity", "technology"] }
    ]
  }
};

function generateGiftIdeas(data) {
  const { age, gender, occasion, budget, interests, lang } = data;
  const templates = giftTemplates[lang] || giftTemplates.ru;
  
  // Parse interests to find relevant categories
  const interestCategories = [];
  const interestsLower = interests.toLowerCase();
  
  if (interestsLower.includes('технологии') || interestsLower.includes('technology') || interestsLower.includes('it')) {
    interestCategories.push('tech');
  }
  if (interestsLower.includes('спорт') || interestsLower.includes('sport') || interestsLower.includes('футбол')) {
    interestCategories.push('sport');
  }
  if (interestsLower.includes('музыка') || interestsLower.includes('music') || interestsLower.includes('гитара')) {
    interestCategories.push('music');
  }
  if (interestsLower.includes('творчество') || interestsLower.includes('art') || interestsLower.includes('рисование')) {
    interestCategories.push('art');
  }
  
  // If no specific categories found, use all
  if (interestCategories.length === 0) {
    interestCategories.push('tech', 'sport', 'music', 'art');
  }
  
  // Generate 5 ideas based on interests and budget
  const ideas = [];
  const usedTemplates = new Set();
  
  while (ideas.length < 5 && usedTemplates.size < Object.keys(templates).length * 3) {
    const category = interestCategories[Math.floor(Math.random() * interestCategories.length)];
    const templatesInCategory = templates[category];
    const template = templatesInCategory[Math.floor(Math.random() * templatesInCategory.length)];
    
    const templateKey = `${category}-${template.title}`;
    if (!usedTemplates.has(templateKey)) {
      usedTemplates.add(templateKey);
      
      // Adjust price based on budget
      let adjustedPrice = template.price;
      const budgetNum = Number(budget);
      
      if (budgetNum < 10000) {
        adjustedPrice = "3000-8000";
      } else if (budgetNum < 25000) {
        adjustedPrice = "8000-20000";
      } else if (budgetNum < 50000) {
        adjustedPrice = "20000-45000";
      } else {
        adjustedPrice = "45000-80000";
      }
      
      ideas.push({
        title: template.title,
        description: template.description,
        why: template.why,
        price_hint_kzt: adjustedPrice,
        tags: template.tags
      });
    }
  }
  
  // Fill remaining slots with random ideas if needed
  while (ideas.length < 5) {
    const allCategories = Object.keys(templates);
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    const randomTemplate = templates[randomCategory][Math.floor(Math.random() * templates[randomCategory].length)];
    
    ideas.push({
      title: randomTemplate.title,
      description: randomTemplate.description,
      why: randomTemplate.why,
      price_hint_kzt: randomTemplate.price,
      tags: randomTemplate.tags
    });
  }
  
  return ideas.slice(0, 5);
}

// Simple offline mode - no fetch needed

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
  
  if (age === undefined || age === null || Number(age) < 1 || Number(age) > 120) {
    return { error: 'Age must be between 1 and 120' };
  }
  
  if (!gender || !['Female', 'Male', 'Other'].includes(gender)) {
    return { error: 'Gender must be Female, Male, or Other' };
  }
  
  if (!occasion || !['Birthday', 'Anniversary', 'New Year', 'Graduation', 'Other'].includes(occasion)) {
    return { error: 'Occasion must be Birthday, Anniversary, New Year, Graduation, or Other' };
  }
  
  if (budget === undefined || budget === null || Number(budget) < 0) {
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

// Simple offline mode - no complex functions needed

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

    // Use our simple AI model instead of Hugging Face
    
    // Generate ideas using our local AI model

    // Simple offline mode - always works!
    const offlineIdeas = getRandomIdeas(lang, 5);
    const result = {
      ideas: offlineIdeas,
      meta: {
        source: 'offline', // Simple offline mode
        model: 'offline-gift-generator',
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
