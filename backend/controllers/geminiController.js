const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// @desc    Analyze food image using Gemini AI
// @route   POST /api/v1/gemini/analyze-food
// @access  Private/Admin
const analyzeFoodImage = asyncHandler(async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }

    // Get the Gemini API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return next(new ErrorResponse('Gemini API key not configured. Please set GEMINI_API_KEY in environment variables.', 500));
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    // Read the uploaded image file
    const imagePath = path.join(__dirname, '..', 'public', 'uploads', req.file.filename);
    const imageBuffer = fs.readFileSync(imagePath);

    // Convert image to base64
    const base64Image = imageBuffer.toString('base64');

    // Create the prompt for Gemini
    const prompt = `Analyze this food image and provide the following information in JSON format:
{
  "foodName": "Name of the food item",
  "description": "Brief description of the food item (2-3 sentences)",
  "category": "Category of the food (appetizer, main-course, dessert, beverage, or special)"
}

Respond ONLY with the JSON object. Do not include any other text.`;

    // Create the image part for Gemini
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: req.file.mimetype
      }
    };

    // Generate content using Gemini
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let foodData;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      foodData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Raw response:', text);
      // Clean up temporary file
      cleanupTempFile(imagePath);
      return next(new ErrorResponse('Failed to parse AI response', 500));
    }

    // Validate and clean the response data
    const validatedData = {
      foodName: foodData.foodName || 'Unknown Item',
      description: foodData.description || 'No description available',
      category: ['appetizer', 'main-course', 'dessert', 'beverage', 'special'].includes(foodData.category) 
        ? foodData.category 
        : 'appetizer'
    };

    // Clean up temporary file
    cleanupTempFile(imagePath);

    res.status(200).json({
      success: true,
      data: validatedData
    });
  } catch (error) {
    console.error('Gemini analysis error:', error);
    // Clean up temporary file if it exists
    if (req.file) {
      const imagePath = path.join(__dirname, '..', 'public', 'uploads', req.file.filename);
      cleanupTempFile(imagePath);
    }
    return next(new ErrorResponse('Failed to analyze image with AI: ' + error.message, 500));
  }
});

// Utility function to clean up temporary files
const cleanupTempFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Temporary file cleaned up:', filePath);
    }
  } catch (error) {
    console.error('Error cleaning up temporary file:', error);
  }
};

module.exports = {
  analyzeFoodImage
};