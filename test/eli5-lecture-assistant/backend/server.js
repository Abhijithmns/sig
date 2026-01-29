const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Groq API (FREE!)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'your-groq-api-key-here'
});

// In-memory cache to avoid duplicate API calls (like the Python app's global variables)
const explanationCache = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'ELI5 Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Main explanation endpoint (similar to translate() function in Python)
app.post('/explain', async (req, res) => {
  try {
    const { term, context } = req.body;

    // Validation (similar to Python's error checking)
    if (!term || term.trim() === '') {
      return res.status(400).json({ 
        error: 'Please provide a term to explain' 
      });
    }

    const cacheKey = term.toLowerCase().trim();

    // Check cache first (optimization)
    if (explanationCache.has(cacheKey)) {
      console.log(`✅ Cache hit for: ${term}`);
      return res.json(explanationCache.get(cacheKey));
    }

    console.log(`🔍 Generating explanation for: ${term}`);

    // Call Groq API (FREE - uses Llama 3.3 70B model)
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a friendly teacher explaining complex terms to a 5-year-old student. Use simple words, everyday examples, and keep explanations to 2-3 sentences."
        },
        {
          role: "user",
          content: `Explain "${term}" in simple terms. Context: "${context || 'No additional context'}"`
        }
      ],
      model: "llama-3.3-70b-versatile", // FREE model
      temperature: 0.7,
      max_tokens: 300,
    });

    const explanation = completion.choices[0]?.message?.content || "Unable to explain this term.";

    const result = {
      term,
      explanation,
      timestamp: new Date().toISOString()
    };

    // Cache the result
    explanationCache.set(cacheKey, result);

    res.json(result);

  } catch (error) {
    console.error('❌ Error generating explanation:', error.message);
    
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your Groq API key.' 
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait a moment.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to generate explanation',
      message: error.message 
    });
  }
});

// Batch explanation endpoint (process multiple terms at once)
app.post('/explain-batch', async (req, res) => {
  try {
    const { terms, context } = req.body;

    if (!terms || !Array.isArray(terms) || terms.length === 0) {
      return res.status(400).json({ 
        error: 'Please provide an array of terms' 
      });
    }

    console.log(`🔍 Processing ${terms.length} terms in batch`);

    const results = [];

    for (const term of terms) {
      const cacheKey = term.toLowerCase().trim();

      // Check cache
      if (explanationCache.has(cacheKey)) {
        results.push(explanationCache.get(cacheKey));
        continue;
      }

      try {
        // Generate explanation with Groq
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are a friendly teacher. Explain terms simply to a 5-year-old in 2-3 sentences."
            },
            {
              role: "user",
              content: `Explain "${term}" simply. Context: "${context || ''}"`
            }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 300,
        });

        const result = {
          term,
          explanation: completion.choices[0]?.message?.content || "Unable to explain.",
          timestamp: new Date().toISOString()
        };

        explanationCache.set(cacheKey, result);
        results.push(result);

      } catch (error) {
        console.error(`Error explaining ${term}:`, error.message);
        results.push({
          term,
          explanation: 'Unable to explain this term right now.',
          error: true
        });
      }
    }

    res.json({ explanations: results });

  } catch (error) {
    console.error('❌ Batch error:', error.message);
    res.status(500).json({ 
      error: 'Failed to process batch explanations' 
    });
  }
});

// Clear cache endpoint (useful for testing)
app.post('/clear-cache', (req, res) => {
  const size = explanationCache.size;
  explanationCache.clear();
  res.json({ 
    message: `Cache cleared! ${size} entries removed.` 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 ELI5 Backend Server Running       ║
║   📡 Port: ${PORT}                        ║
║   🌐 URL: http://localhost:${PORT}      ║
╚════════════════════════════════════════╝
  `);
});
