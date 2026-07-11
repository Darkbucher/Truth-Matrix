<div align="center">

# TruthMatrix

**An unbiased information synthesis tool that grounds AI answers in live, credible web sources.**

Ask a question or paste a claim — TruthMatrix retrieves current information from trusted sources via RAG, then uses Google Gemini to synthesize a structured, cited answer instead of relying on the model's own (potentially outdated or biased) internal knowledge.

![TruthMatrix](https://img.shields.io/badge/TruthMatrix-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Express](https://img.shields.io/badge/Express-4.18-green)

[**Live Demo**](#) &nbsp;·&nbsp; [**Watch Video Walkthrough**](#)

</div>

---

<!--
  📸 ADD A SCREENSHOT OR GIF HERE — this is the single most important addition.
  Replace this comment with:
  ![TruthMatrix screenshot](./docs/screenshot.png)
  A 5–10 second GIF of a query being asked and answered works even better than a static image.
-->

## How It Works

TruthMatrix doesn't just ask an AI for an answer — it checks the live web first, filters for trustworthy sources, and only then lets the AI synthesize a response:

![A simple 5-step visual: you ask a question, it searches the live web, only trustworthy sources make it through, AI reads it all together, and you get one clear answer with sources shown](![How TruthMatrix works](https://i.ibb.co/Pzgf2wnf/architecture-diagram-v2.jpg))

1. **You ask** a question or a claim you want checked.
2. **It searches** the live, current web in real time — not the model's own memory.
3. **Only trustworthy sources make it through** — everything else is filtered out.
4. **AI reads it all and thinks it through together** — not just one source in isolation.
5. **You get one clear, honest answer**, with its sources shown, so you can verify it yourself.

This "check first, then explain" pattern is what keeps answers current and reduces the risk of a confidently wrong response.

## Features

| Frontend | Backend | AI & Security |
|----------|---------|---------------|
| Modern React 18 with TypeScript | Express.js server | Google Gemini integration |
| Tailwind CSS & Radix UI | Passport authentication | Tavily Search API (RAG) |
| Responsive design | Neon PostgreSQL (Drizzle ORM) | Transparent source citations |

## Tech Stack

**Frontend**
- React 18 — concurrent rendering, latest features
- TypeScript — type-safe development
- Tailwind CSS — utility-first styling
- Radix UI — accessible component primitives
- React Query — data fetching and caching
- Wouter — lightweight client-side routing

**Backend**
- Express.js — fast, unopinionated web framework
- TypeScript — type-safe backend development
- Neon (PostgreSQL) — serverless relational database
- Drizzle ORM — type-safe database access
- Google Gemini API — LLM-powered synthesis
- Tavily Search API — live web retrieval for RAG grounding

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Darkbucher/TruthMatrix.git
cd TruthMatrix

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# then fill in the values below

# 4. Start the dev server
npm run dev
```

**.env**
```env
SESSION_SECRET=your_session_secret
GOOGLE_AI_API_KEY=your_google_api_key
TAVILY_API_KEY=your_tavily_api_key
DATABASE_URL="postgresql://user:pass@ep-host.aws.neon.tech/neondb?sslmode=require"
```

## Project Structure

```
TruthMatrix/
├── client/              # Frontend React application
│   ├── src/             # Source files
│   ├── public/          # Static assets
│   └── tests/           # Frontend tests
├── server/               # Backend Express application
│   ├── src/              # Source files
│   ├── routes/           # API routes
│   └── tests/            # Backend tests
├── shared/                # Shared types and utilities
├── attached_assets/       # Static assets
└── .config/               # Configuration files
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run check` | Type check |
| `npm run test` | Run tests |

## Note on the Database

TruthMatrix uses a Neon serverless PostgreSQL database to persist fact-check verifications. When deploying to production, push the Drizzle schema to your production DB first:

```bash
npx drizzle-kit push
```

## Contributing

Contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by [Adarsh Singh](https://github.com/Darkbucher)

[![GitHub stars](https://img.shields.io/github/stars/Darkbucher/TruthMatrix?style=social)](https://github.com/Darkbucher/TruthMatrix/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Darkbucher/TruthMatrix?style=social)](https://github.com/Darkbucher/TruthMatrix/network/members)

</div>
