# HEXCLOUD Landing - Gemini AI Feedback Analysis

This project implements a serverless function for analyzing user feedback using Google's Gemini AI API.

## Serverless Function

### `/api/analyze-feedback.js`

A Vercel serverless function that:
- Receives feedback via POST request
- Reads the Gemini API key from `process.env.GEMINI_API_KEY`
- Calls the Gemini AI API to analyze and categorize feedback
- Returns a processed response with empathy and categorization

**Input:**
```json
{
  "feedback": "Odio hacer inventario todo el tiempo, es muy tedioso y consume mucho tiempo"
}
```

**Output:**
```json
{
  "success": true,
  "category": "Inventario",
  "empathy_response": "Entendemos que el inventario manual puede ser muy frustrante y consume tiempo valioso."
}
```

## Frontend Integration

The `index.html` file has been updated to:
- Call the serverless function instead of directly calling the Gemini API
- Maintain all existing UI functionality
- Provide proper error handling and loading states

## Environment Configuration

To deploy on Vercel, add the following environment variable:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Security Improvements

✅ **Before**: API key exposed in frontend code
✅ **After**: API key securely stored in server-side environment variables

## Testing

The implementation has been tested for:
- ✅ Valid feedback processing
- ✅ Error handling for invalid requests
- ✅ Proper HTTP status codes (200, 400, 405, 500)
- ✅ Frontend form integration
- ✅ UI state management and transitions

## Deployment

1. Deploy to Vercel
2. Set the `GEMINI_API_KEY` environment variable in Vercel dashboard
3. The serverless function will be automatically available at `/api/analyze-feedback`