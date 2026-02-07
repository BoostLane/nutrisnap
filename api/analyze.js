module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { provider, base64Data, mimeType, prompt } = req.body;

        if (!base64Data || !mimeType || !prompt) {
            return res.status(400).json({ error: 'Missing required fields: base64Data, mimeType, prompt' });
        }

        const selectedProvider = provider || 'claude';
        let result;

        if (selectedProvider === 'claude') {
            const claudeKey = process.env.CLAUDE_API_KEY;
            if (!claudeKey) {
                return res.status(500).json({ error: 'Claude API key not configured on server' });
            }
            result = await callClaude(claudeKey, base64Data, mimeType, prompt);
        } else {
            const openaiKey = process.env.OPENAI_API_KEY;
            if (!openaiKey) {
                return res.status(500).json({ error: 'OpenAI API key not configured on server' });
            }
            result = await callOpenAI(openaiKey, base64Data, mimeType, prompt);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('API proxy error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

async function callClaude(apiKey, base64Data, mimeType, prompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            messages: [{
                role: 'user',
                content: [
                    { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64Data } },
                    { type: 'text', text: prompt }
                ]
            }]
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error('Claude API error ' + response.status + ': ' + errText);
    }

    const data = await response.json();
    const content = data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format from Claude');
    return JSON.parse(jsonMatch[0]);
}

async function callOpenAI(apiKey, base64Data, mimeType, prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            max_tokens: 1024,
            messages: [{
                role: 'user',
                content: [
                    { type: 'image_url', image_url: { url: 'data:' + mimeType + ';base64,' + base64Data } },
                    { type: 'text', text: prompt }
                ]
            }]
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error('OpenAI API error ' + response.status + ': ' + errText);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format from OpenAI');
    return JSON.parse(jsonMatch[0]);
}
