# Lunatik Project Documentation

Welcome to the Lunatik project! This document provides a high-level overview of the project's architecture, technologies, and development conventions to help you navigate and contribute effectively.

## Project Overview

Lunatik is a web-based management system designed for a World of Warcraft guild (WotLK 3.3.5a). It serves as a comprehensive tool for Dragon Kill Points (DKP) management, Best-in-Slot (BiS) gear tracking, and advanced Combat Log analysis.

### Core Features
- **DKP Tracking:** A comprehensive table showing players, their classes, ranks, and current DKP (Net, Spent, Total).
- **Combat Log Analysis:** In-browser processing of `WoWCombatLog.txt` files to generate fight summaries, DPS/HPS rankings, and consumable usage reports.
- **BiS Lists:** Multilingual (ES/EN) lists of optimal gear for different classes and specializations.
- **User Authentication:** Login and registration system for guild members and administrators.
- **Player Details & Scraping:** Integration with Warmane Armory via a specialized scraper API to display character gear, gems, and enchantments.
- **External Integrations:** Links to Warmane Armory and UltimoWoW for tooltips and character profiles.

## Technologies

- **Frontend:** React 18 with Vite.
- **State Management:** Redux Toolkit with `redux-persist` for session persistence and `redux-thunk` for async actions.
- **Styling:** Tailwind CSS (with custom WoW class colors), Material UI, and Vanilla CSS.
- **Processing:** Web Workers for high-performance, non-blocking Combat Log parsing.
- **Routing:** React Router 6.
- **Icons:** `react-icons` (Game Icons for WoW-themed elements).
- **Backend Integrations:**
  - `grimreaper-back`: Express/PostgreSQL backend for DKP and Log storage.
  - `Warmane Scraper API`: Specialized Puppeteer-based API for character data extraction.
- **Deployment:** Vercel (primary) and Cloudflare Pages (via Wrangler).

## Directory Structure

```text
Lunatik/
├── data/                   # JSON data files (e.g., item_bis.json)
├── docs/                   # Guild rules and loot policies
├── public/                 # Static assets (SVGs, icons)
├── src/
│   ├── assets/             # Images, local SVGs, and video backgrounds
│   ├── components/         # Reusable UI components (AddDKP, Cards, Navbar, Search)
│   ├── helpers/            # Utility functions and API helpers
│   ├── redux/              # Redux setup (slices, actions, store)
│   ├── views/              # Main page views (Home, ItemsBis, Admin, LootTable, Logs)
│   ├── App.jsx             # Main App component and routing
│   └── main.jsx            # Entry point
├── API_CONTRACTS.md        # Detailed backend API definitions
├── API_SCRAP_CONTRACT.md   # Scraper API definitions and usage
├── Plan-wow-combatlog.md   # Implementation roadmap for the Combat Log Parser
├── .agent/                 # Agent-specific skills and rules
├── tailwind.config.js      # Tailwind CSS configuration (includes WoW class colors)
├── wrangler.jsonc          # Cloudflare Pages configuration
└── vite.config.js          # Vite configuration
```

## Building and Running

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm

### Commands
- **Install Dependencies:** `npm install`
- **Start Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Lint Code:** `npm run lint`
- **Preview Production Build:** `npm run preview`

## Development Conventions

- **Component Structure:** Components are organized into folders with their respective `.jsx` and `.css` files.
- **Naming Conventions:**
  - Components: PascalCase (e.g., `HeroSection.jsx`).
  - Slices/Actions: camelCase (e.g., `playerSlice.js`).
  - Directories: PascalCase for components, camelCase for logic.
- **Styling:**
  - Prefer Tailwind CSS classes for layout.
  - WoW class colors (e.g., `class-dk`, `class-mage`) are available in Tailwind.
- **Log Processing:** All heavy file processing MUST occur in Web Workers to keep the UI responsive.
- **State Management:**
  - Use Redux Toolkit slices.
  - Persist critical session state using `redux-persist`.
- **Formatting:** Prettier is configured (`.prettierrc`): no semicolons, single quotes.

## Documentation References

- **Backend API:** See `API_CONTRACTS.md` for endpoints related to characters, DKP, and logs.
- **Scraper API:** See `API_SCRAP_CONTRACT.md` for character gear extraction details.
- **Combat Log Plan:** See `Plan-wow-combatlog.md` for the technical architecture of the log parser.

## Agent Skills

This project includes specialized agent skills located in `.agent/skills` and `.agents/skills`. These provide instructions for:
- **Redux Toolkit:** Best practices for state management.
- **Vercel React Best Practices:** Performance optimization and React patterns.

---

*Note: This file is used as context for Gemini CLI. Do not remove or modify essential sections without understanding their impact on agent performance.*
