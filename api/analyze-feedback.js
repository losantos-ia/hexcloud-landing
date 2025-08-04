export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the feedback from the request body
    const { feedback } = req.body;

    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ error: 'Feedback is required' });
    }

    // Get the Gemini API key from environment variables
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Prepare the prompt for Gemini
    const prompt = `
      Analiza el siguiente 'punto de dolor' de un gerente de taller y clasifícalo en una de estas categorías: [Inventario, Facturación, Clientes, Rentabilidad, Tareas Administrativas, Otro].
      Además, escribe una frase empática de una línea (máximo 25 palabras) reconociendo su frustración.
      El texto del usuario es: "${feedback}"
      Responde únicamente con un objeto JSON válido con las claves "category" y "empathy_response".
    `;

    // Call the Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API responded with status: ${response.status}`);
    }

    const result = await response.json();
    const geminiText = result.candidates[0].content.parts[0].text;
    const geminiData = JSON.parse(geminiText);

    // Return the processed response
    return res.status(200).json({
      success: true,
      category: geminiData.category || 'Otro',
      empathy_response: geminiData.empathy_response || 'Entendemos tu frustración y trabajamos para solucionarlo.'
    });

  } catch (error) {
    console.error('Error processing feedback:', error);
    return res.status(500).json({ 
      error: 'Error processing feedback',
      message: error.message 
    });
  }
}