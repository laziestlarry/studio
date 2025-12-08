# BizOp Navigator – AI-Powered Business Strategy Studio

BizOp Navigator is a Next.js application that uses generative AI to turn messy business knowledge into **structured, execution-ready blueprints**.

You paste in plans, notes, decks, or knowledge dumps.
The studio then:

* Detects and scores potential business opportunities
* Builds a structured business model and strategy
* Expands it into an action-ready execution plan
* Presents everything in a clean, investor- and team-friendly format

---

## What You Can Do With It

* **Opportunity Radar** – Scan long-form text and surface promising venture angles ranked by potential, risk, and time-to-impact.
* **Model & Strategy Builder** – Auto-generate a full business design: customers, value props, channels, revenue streams, key activities/resources/partners, and risk notes.
* **Decision & Planning View** – Turn the strategy into:

  * Action lists
  * Kanban-style categories (e.g., Biz Dev, Product, Ops, Finance)
  * Timeline / phase-based execution suggestions
* **“Genesis Protocol” Simulation** – Run a narrative-style simulation of an AI-driven company executing the plan so stakeholders can “see the movie” of the business being built.
* **Export-Ready Blueprint** – Produce a single, coherent document that can be used as:

  * Board / IC memo
  * Investor brief
  * Internal execution charter

---

## Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript + React
* **Styling:** Tailwind CSS + ShadCN UI components
* **AI Layer:** Google Gemini via Genkit
* **Hosting / Runtime:** Firebase App Hosting + Node runtime (see `apphosting.yaml`)

---

## Local Development

> The app is designed to run smoothly inside **Firebase Studio**, but it can also be run as a standard Next.js project.

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create `.env.local` in the project root using the template below (see also `.env.example` if present):

```bash
# AI
GOOGLE_GENAI_API_KEY=your_gemini_key_here

# Firebase client config (public)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

> Never commit `.env.local` – keep secrets local or in your CI/CD secret store.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start pasting business text into the main canvas.

---

## Genkit / AI Dev Utilities

The project ships with Genkit tooling for experimenting with flows and prompts:

```bash
# Start Genkit dev console for AI flows
npm run genkit:dev

# Start Genkit in watch mode
npm run genkit:watch
```

Use these to iterate on the “analysis” and “blueprint” flows without touching the UI.

---

## Deploying with Firebase App Hosting

This repo includes `apphosting.yaml` for Firebase App Hosting configuration.

High-level flow:

1. Install Firebase tools:

   ```bash
   npm install -g firebase-tools
   ```

2. Initialize / select your Firebase project:

   ```bash
   firebase login
   firebase use <your-firebase-project-id>
   ```

3. Build the Next.js app:

   ```bash
   npm run build
   ```

4. Deploy via App Hosting (from Firebase Studio or CLI, depending on your setup).

> `apphosting.yaml` currently limits the runtime to a single instance (`maxInstances: 1`). Bump this if you expect higher traffic.

---

## Repo Structure (High-Level)

* `src/` – Application code (app router, components, AI flows, UI)
* `docs/` – Space for product / architecture docs
* `apphosting.yaml` – Firebase App Hosting config
* `components.json`, `tailwind.config.ts`, `postcss.config.mjs` – UI / styling infrastructure
* `package.json` – Scripts and dependency definitions
* `tsconfig.json` – TypeScript configuration

---

## Roadmap Ideas

* Saved workspaces for multiple projects / clients
* Export to PDF / Google Docs / Notion
* Multi-agent “board view” (Strategy, Ops, Finance, Risk) commenting on the same plan
* Integration with task tools (Jira, Linear, ClickUp, Asana) to push the generated action plan directly into teams’ backlogs

---

## License

You can add your preferred license here (MIT is a good default for open use).
