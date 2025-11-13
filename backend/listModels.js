// Script to list available Gemini models
const dotenv = require('dotenv');
const https = require('https');

// Load environment variables
dotenv.config({ path: './.env' });

// Get the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  console.error('Error: GEMINI_API_KEY not set in environment variables');
  process.exit(1);
}

// Function to make HTTPS request
function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function listModels() {
  try {
    console.log('Fetching available models...');
    
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: '/v1beta/models?key=' + apiKey,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(options);
    
    if (response.models) {
      console.log('Available models:');
      response.models.forEach(model => {
        console.log(`- ${model.name} (${model.displayName})`);
        if (model.description) {
          console.log(`  Description: ${model.description}`);
        }
        console.log(`  Supported methods: ${model.supportedGenerationMethods ? model.supportedGenerationMethods.join(', ') : 'None'}`);
        console.log('');
      });
    } else {
      console.log('Response:', JSON.stringify(response, null, 2));
    }
  } catch (error) {
    console.error('Error fetching models:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

listModels();