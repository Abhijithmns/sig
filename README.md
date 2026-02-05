# ELI5 Assistant — Live Lecture Simplifier

ELI5 Assistant is a real-time lecture assistance tool that listens during live classes and explains complex concepts instantly using simple, age-appropriate explanations.

The goal of this project is to help students understand difficult material as it is being taught, rather than after the lecture ends.

---

## Overview

During live lectures, students often miss important ideas due to fast pacing, unfamiliar terminology, or cognitive overload. ELI5 Assistant addresses this problem by providing real-time explanations that simplify complex concepts while the lecture is ongoing.

The system listens to spoken lecture content, converts speech to text, and generates simplified explanations on demand in a clean, distraction-free interface.

This project focuses on accessibility, inclusivity, and real-time comprehension.

---

## Features

- Real-time speech recognition using the Web Speech API
- Live conversion of speech to text
- On-demand simplification of lecture content
- Multiple explanation levels:
  - Explain Like I’m 5
  - Explain Like I’m 10
  - Explain Like I’m 15
  - Concise summary
- Minimal and calm user interface designed for classroom use
- Backend model fallback to handle rate limits
- Secure configuration using environment variables

---

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- Tailwind CSS
- Shadcn/UI
- Web Speech API
- Outfit font for readability and consistency

### Backend
- Node.js
- Express
- OpenRouter API
- REST-based JSON API

---

## AI Model

The project uses **TNG-R1T Chimera (free)** via **OpenRouter** to generate simplified explanations.

This model was chosen because it produces clear, structured responses and performs well for explanation-focused tasks. It is suitable for real-time use in a live lecture setting.

Since the model is accessed through a free tier, it may occasionally be rate-limited. To ensure reliability, the backend includes fallback logic that switches to alternative models when necessary.

---

## Project Structure

```txt
sig/
├─ backend/
│  ├─ server.js
│  ├─ package.json
│  └─ .env
│
└─ frontend/
   ├─ src/
   │  ├─ components/
   │  ├─ services/
   │  ├─ hooks/
   │  └─ pages/
   ├─ public/
   ├─ index.html
   ├─ tailwind.config.ts
   └─ vite.config.ts
