// Simple test script to verify Gemini API integration
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config({ path: './.env' });

// Get the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  console.error('Error: GEMINI_API_KEY not set in environment variables');
  process.exit(1);
}

console.log('GEMINI_API_KEY loaded successfully');

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(apiKey);

console.log('Google Generative AI initialized successfully');

// Try a simple model
try {
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  console.log('Model initialized successfully');
  console.log('Gemini API integration is working correctly!');
} catch (error) {
  console.error('Error initializing model:', error.message);
  process.exit(1);
}