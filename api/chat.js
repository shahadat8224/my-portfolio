export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a professional AI assistant for Shahadat Islam Alif. 
                        Keep answers short and professional. 
                        Shahadat is a Content Researcher and Language Influencer.
                        If asked about contact, give: 01320828224.
                        User asks: ${message}`
                    }]
                }]
            })
        });

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        
        res.status(200).json({ reply });
    } catch (error) {
        res.status(500).json({ error: 'Failed to connect to Gemini' });
    }
}
export default async function handler(req, res) {
    // 1. Safety Check for Request Method
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: 'Method not allowed' });
    }

    // 2. Safety Check for API Key
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        return res.status(500).json({ reply: 'Error: API Key is missing in Vercel settings.' });
    }

    try {
        const { message } = req.body;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `You are Alif's portfolio assistant. User asks: ${message}` }]
                }]
            })
        });

        const data = await response.json();

        // 3. Handle Google API Errors
        if (data.error) {
            return res.status(500).json({ reply: 'AI Error: ' + data.error.message });
        }

        const reply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply });

    } catch (error) {
        res.status(500).json({ reply: 'Server Error: ' + error.message });
    }
}
