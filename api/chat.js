export default async function handler(req, res) {
  // 1. Handle Preflight requests (Security)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { message } = JSON.parse(req.body);
    const API_KEY = process.env.GEMINI_API_KEY;

    // 2. Call the Google Gemini API using built-in fetch
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await response.json();

    // 3. Send the response back to your website
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      console.error('Google API Error:', data);
      res.status(500).json({ reply: "AI Error: Check your Gemini API Key in Vercel." });
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ reply: "Server Error: " + error.message });
  }
        }
    
