# ELI5 Lecture Assistant - Backend

## 🆓 100% FREE API (Groq)

This backend uses **Groq API** which is completely free with generous limits:
- **14,400 requests per day**
- **No credit card required**
- **Fast inference (< 1 second)**

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Get Free Groq API Key

1. Go to: **https://console.groq.com**
2. Sign up (FREE - no credit card needed!)
3. Go to API Keys section
4. Create new API key
5. Copy it

### 3. Configure API Key
Create a `.env` file:
```bash
cp .env.example .env
```

Then edit `.env` and add your Groq API key:
```
GROQ_API_KEY=gsk_your_key_here
```

### 4. Start Server
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### `POST /explain`
Explain a single term

**Request:**
```json
{
  "term": "photosynthesis",
  "context": "Plants convert sunlight to glucose"
}
```

**Response:**
```json
{
  "term": "photosynthesis",
  "explanation": "It's like how you eat food for energy! Plants 'eat' sunlight...",
  "timestamp": "2025-01-29T..."
}
```

### `POST /explain-batch`
Explain multiple terms at once

**Request:**
```json
{
  "terms": ["mitochondria", "DNA", "enzyme"],
  "context": "Biology lecture about cells"
}
```

### `GET /health`
Check if server is running

## Testing

Test with curl:
```bash
curl -X POST http://localhost:3001/explain \
  -H "Content-Type: application/json" \
  -d '{"term":"blockchain","context":"cryptocurrency technology"}'
```

## Why Groq?

✅ **100% Free** - No credit card ever
✅ **Fast** - Sub-second responses
✅ **Powerful** - Llama 3.3 70B model
✅ **Generous limits** - 14,400 requests/day
✅ **Perfect for hackathons!**
