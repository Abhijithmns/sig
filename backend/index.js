require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // ← REQUIRED

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ELI5 Backend is running' });
});

// ELI5 endpoint
app.post('/api/eli5', async (req, res) => {
  try {
    const { text, complexity = 'eli5' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid text field'
      });
    }

    if (text.length > 10000) {
      return res.status(400).json({
        error: 'Text too long. Maximum 10,000 characters.'
      });
    }

    // Complexity prompts
    const complexityPrompts = {
      eli5: "Explain this like I'm 5 years old. Use very simple words, fun analogies, and short sentences.",
      eli10: "Explain this like I'm 10 years old. Use simple language with relatable examples.",
      eli15: "Explain this like I'm 15 years old. Be clear, avoid jargon, but include useful detail.",
      summary: "Provide a short, clear summary of this content."
    };

    const systemPrompt =
      complexityPrompts[complexity] || complexityPrompts.eli5;

    //  OPENROUTER CALL
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://sig-eli5.netlify.app/', // frontend URL
          'X-Title': 'ELI5 Lecture Assistant'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [
            {
              role: 'system',
              content: `You are an expert at simplifying concepts. ${systemPrompt}`
            },
            {
              role: 'user',
              content: `Please explain the following:\n\n${text}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.choices?.[0]?.message?.content) {
      console.error('OpenRouter error:', data);
      return res.status(500).json({
        error: 'Failed to generate explanation'
      });
    }

    const explanation = data.choices[0].message.content;

    res.json({
      success: true,
      explanation,
      complexity,
      originalLength: text.length,
      explanationLength: explanation.length
    });

  } catch (error) {
    console.error('ELI5 Error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(` ELI5 Backend running on http://localhost:${PORT}`);
  console.log(` POST /api/eli5`);
  console.log(`  GET /api/health`);
});
