from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
import json
import random

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# Gift categories and sample data
GIFT_CATEGORIES = {
    "tech": ["Smartphone", "Wireless Earbuds", "Smart Watch", "Laptop", "Tablet", "Gaming Console", "VR Headset"],
    "fashion": ["Designer Bag", "Watch", "Jewelry", "Shoes", "Clothing", "Accessories", "Perfume"],
    "home": ["Kitchen Appliances", "Home Decor", "Furniture", "Smart Home Devices", "Plants", "Artwork"],
    "hobbies": ["Books", "Musical Instruments", "Sports Equipment", "Craft Supplies", "Camera", "Board Games"],
    "wellness": ["Spa Gift Card", "Fitness Tracker", "Yoga Mat", "Meditation App", "Massage Chair", "Essential Oils"],
    "food": ["Gourmet Food Basket", "Wine/Champagne", "Cooking Class", "Restaurant Gift Card", "Chocolate Box", "Coffee/Tea Set"]
}

RELATIONSHIPS = ["Partner", "Parent", "Child", "Sibling", "Friend", "Colleague", "Boss", "Teacher", "Neighbor"]

def get_ai_gift_recommendations(recipient_info, budget, occasion, interests):
    """Get AI-powered gift recommendations"""
    try:
        prompt = f"""
        Suggest 5 personalized gift ideas for:
        - Recipient: {recipient_info}
        - Budget: ${budget}
        - Occasion: {occasion}
        - Interests: {interests}
        
        For each suggestion, provide:
        1. Gift name
        2. Brief description
        3. Estimated price range
        4. Why it's perfect for this person
        
        Format as JSON with fields: name, description, price_range, reasoning
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful gift recommendation assistant. Provide thoughtful, personalized gift suggestions."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        # Try to parse JSON response
        try:
            suggestions = json.loads(response.choices[0].message.content)
            return suggestions if isinstance(suggestions, list) else [suggestions]
        except json.JSONDecodeError:
            # Fallback to structured response parsing
            content = response.choices[0].message.content
            return parse_ai_response(content)
            
    except Exception as e:
        print(f"AI API Error: {e}")
        return get_fallback_recommendations(interests, budget)

def parse_ai_response(content):
    """Parse AI response when JSON parsing fails"""
    suggestions = []
    lines = content.split('\n')
    current_suggestion = {}
    
    for line in lines:
        line = line.strip()
        if line.startswith('1.') or line.startswith('2.') or line.startswith('3.') or line.startswith('4.') or line.startswith('5.'):
            if current_suggestion:
                suggestions.append(current_suggestion)
            current_suggestion = {'name': line.split('.', 1)[1].strip() if '.' in line else line}
        elif 'description' in line.lower() or 'description:' in line:
            current_suggestion['description'] = line.split(':', 1)[1].strip() if ':' in line else line
        elif 'price' in line.lower():
            current_suggestion['price_range'] = line.split(':', 1)[1].strip() if ':' in line else line
        elif 'why' in line.lower() or 'reasoning' in line.lower():
            current_suggestion['reasoning'] = line.split(':', 1)[1].strip() if ':' in line else line
    
    if current_suggestion:
        suggestions.append(current_suggestion)
    
    return suggestions

def get_fallback_recommendations(interests, budget):
    """Fallback recommendations when AI is unavailable"""
    suggestions = []
    
    # Simple keyword matching
    interest_keywords = interests.lower().split()
    
    for category, items in GIFT_CATEGORIES.items():
        for keyword in interest_keywords:
            if keyword in category or any(keyword in item.lower() for item in items):
                for item in items[:2]:  # Take first 2 items from matching category
                    suggestions.append({
                        'name': item,
                        'description': f'A great {category} gift for someone who loves {interests}',
                        'price_range': f'${random.randint(20, int(budget))}',
                        'reasoning': f'This {category} item would be perfect for someone interested in {interests}'
                    })
                    if len(suggestions) >= 5:
                        break
        if len(suggestions) >= 5:
            break
    
    # Fill remaining slots with general suggestions
    while len(suggestions) < 5:
        category = random.choice(list(GIFT_CATEGORIES.keys()))
        item = random.choice(GIFT_CATEGORIES[category])
        suggestions.append({
            'name': item,
            'description': f'A thoughtful {category} gift',
            'price_range': f'${random.randint(20, int(budget))}',
            'reasoning': f'This is a popular choice for {category} enthusiasts'
        })
    
    return suggestions[:5]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.get_json()
        
        recipient_info = data.get('recipient_info', '')
        budget = data.get('budget', 100)
        occasion = data.get('occasion', 'General')
        interests = data.get('interests', '')
        
        # Validate inputs
        if not recipient_info or not interests:
            return jsonify({'error': 'Recipient info and interests are required'}), 400
        
        if budget <= 0:
            return jsonify({'error': 'Budget must be positive'}), 400
        
        # Get AI recommendations
        recommendations = get_ai_gift_recommendations(recipient_info, budget, occasion, interests)
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'total_found': len(recommendations)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories')
def get_categories():
    return jsonify({
        'categories': list(GIFT_CATEGORIES.keys()),
        'relationships': RELATIONSHIPS
    })

@app.route('/api/sample-gifts/<category>')
def get_sample_gifts(category):
    if category in GIFT_CATEGORIES:
        return jsonify({
            'category': category,
            'gifts': GIFT_CATEGORIES[category]
        })
    return jsonify({'error': 'Category not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
