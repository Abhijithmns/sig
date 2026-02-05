# ELI5 Lecture Assistant - Backend

Express backend for the ELI5 Lecture Assistant.

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   PORT=3001
   ```

4. Start the server:
   ```bash
   npm run dev   # Development with auto-reload
   npm start     # Production
   ```

## API Endpoints

### POST /api/eli5

Simplifies lecture content.

**Request Body:**
```json
{
  "text": "Your lecture content here...",
  "complexity": "eli5"  // Options: eli5, eli10, eli15, summary
}
```

**Response:**
```json
{
  "success": true,
  "explanation": "Simplified explanation...",
  "complexity": "eli5",
  "originalLength": 500,
  "explanationLength": 200
}
```

### GET /api/health

Health check endpoint.

## Complexity Levels

- **eli5**: Like explaining to a 5-year-old (simplest)
- **eli10**: Like explaining to a 10-year-old
- **eli15**: Like explaining to a 15-year-old
- **summary**: Concise summary with simplified concepts
