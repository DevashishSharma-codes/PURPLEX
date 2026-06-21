# 🔍 Purplex — An Advanced AI-Powered Research Assistant

Purplex is a premium, feature-rich **Perplexity AI Clone** built using a modern decoupled architecture. It leverages advanced search-driven Retrieval-Augmented Generation (RAG) to provide direct, cited, and summarized answers to user queries, eliminating the traditional list of blue search engine links.

---

## 🎨 Design & Aesthetics
Purplex features a bespoke **Warm Paper Aesthetic** that prioritizes high-end typography and smooth animations:
- **Typography:** Custom Google Fonts combination of Serif (`Libre Baskerville`) and clean Sans-Serif (`Geist`).
- **Interactive Visuals:** 
  - **Dynamic ASCII Canvas:** Responsive hero header on the landing page that dynamically renders the logo name using variable-density pixel-based ASCII characters.
  - **Live network graph:** Interactive HTML5 canvas depicting a live force-directed RAG flow (Query ➔ Agent ➔ Search Sources ➔ Merge ➔ Answer) with animated terracotta particles.
  - **Mock browser preview:** Character-by-character live preview showcasing simulated real-time query inputs, source fetching, and streaming answers.
- **Micro-Animations:** Hover states, loading indicator pulses, sliding search source chips, and streaming text cursors.

---

## 🚀 Key Features

### 💻 Frontend (React SPA)
*   **Dynamic Landing Page:** An incredibly detailed marketing front-end complete with visual bento grids, pricing plan toggles, interactive previews, interactive docs, and mock blog layouts.
*   **Intuitive Chat Dashboard:**
    *   **Typewriter Auto-complete Placeholders:** Dynamic input prompt placeholders that rotate using a typing effect.
    *   **In-progress Search Stages:** Visual updates tracking search progression (e.g., *"Searching the live web..."*, *"Reading sources..."*).
    *   **Markdown Renderer:** Rich-text markdown support for headers, tables, code blocks, lists, quotes, and links inside streaming answers.
    *   **Character Streaming:** Simulated first-token latency with progressive chunk-based typewriter stream rendering.
    *   **Source Citations:** Citation chips mapping out exact search domains used for generating answers (Wired, Arxiv, Reddit, Github, etc.).
    *   **Sidebar Context Management:** Historical conversations grouped chronologically (*Today*, *Yesterday*, *This week*, *Older*) with real-time updates and interactive chat deletion.
*   **Secure Authentication Flow:** Visual portals for Login and Account Registration linked to JWT session states.

### ⚙️ Backend (Express RAG Core)
*   **LangChain & LangGraph Integration:** Modular AI chain workflows utilizing Mistral Large (`mistral-large-latest`) for query resolution and Mistral Small (`mistral-small-latest`) for chat titles.
*   **Internet Search Integration:** Search queries are enriched with contextual variables and queried against the **Tavily Core API** to yield live web data.
*   **Deduplication Guard:** In-flight request map that tracks concurrent duplicate queries to reuse existing active promises and reduce LLM overhead.
*   **Google OAuth2 Mailer:** Account verification emails are dispatched via **Nodemailer** using OAuth2-authenticated Gmail servers.
*   **Robust Session Management:** User tokens are managed securely through server-side signature checks, signed cookies (`httpOnly`, `sameSite: "lax"`), and `bcrypt` password hashes.
*   **Socket.IO Server Setup:** Pre-configured socket connections ready to support full real-time bidirectionality.
*   **Validations:** Strict Express Request validations powered by `express-validator`.

---

## 📂 Project Directory Structure

```text
purplex/
├── Backend/                   # Node.js + Express backend service
│   ├── server.js              # Server bootstrapper & Socket.IO mounting
│   └── src/
│       ├── app.js             # Express app setup, middleware, and route mounting
│       ├── config/            # DB configuration setup (MongoDB connection)
│       ├── controllers/       # Route action handlers (Auth, Chats)
│       ├── middleware/        # JWT Authentication validator
│       ├── models/            # Mongoose Schemas (User, Chat, Message)
│       ├── routes/            # REST API Endpoint definitions (auth router, chats router)
│       ├── services/          # Core RAG, Tavily search, and OAuth2 Mailer services
│       ├── sockets/           # Real-time WebSocket connection controllers
│       └── validators/        # Express validation pipelines (auth validation schemas)
│
└── Frontend/                  # Vite + React client application
    ├── index.html             # Client mounting HTML entrypoint
    ├── tailwind.config.js     # PostCSS & Tailwind utilities config
    └── src/
        ├── main.jsx           # ReactDOM renderer and Redux store injection
        ├── App.css            # Stylesheets configuration
        ├── app/               # Global routing, root Redux store, and root App layout
        ├── features/          # Redux slices, custom hooks, services, and views
        │   ├── auth/          # Authentication state, handlers, portals, and route guards
        │   └── chat/          # Chat conversation histories, RAG flows, and layouts
        └── lib/               # Shared frontend utility helper functions
```

---

## 🛠️ Tech Stack & Key Libraries

### **Frontend**
- **Core Framework:** React 19 (JavaScript SPA)
- **Build Engine:** Vite 8
- **State Manager:** Redux Toolkit + React Redux
- **Router:** React Router DOM v7
- **Style Utilities:** Tailwind CSS + Autoprefixer + PostCSS + Clsx + Tailwind Merge
- **Animations:** Framer Motion
- **Icons:** Lucide React

### **Backend**
- **Application Framework:** Express 5
- **Database Layer:** MongoDB + Mongoose 9
- **AI RAG Orchestrator:** LangChain Core 1 + LangGraph
- **Search Provider:** Tavily Core SDK
- **Session Auth:** JSON Web Tokens (JWT) + Cookies Parser + Bcrypt
- **Mailer:** Nodemailer + Google APIs OAuth2 Client
- **Realtime Comm:** Socket.IO
- **Logger:** Morgan

---

## 🔑 Environment Setup

Create a `.env` file inside the `Backend/` directory with the following variables:

```ini
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Nodemailer OAuth2 Credentials (using Gmail)
GOOGLE_USER=your_gmail_address
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token

# AI Models & Web APIs
MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_search_api_key
```

---

## 🏁 Getting Started

### 1️⃣ Run the Database & Backend Server
Navigate to the `Backend` directory, install package dependencies, and spin up the development watch server:

```bash
cd Backend
npm install
npm run dev
```
The server will boot and connect to MongoDB, listening on `http://localhost:3000`.

### 2️⃣ Run the Client Application
Navigate to the `Frontend` directory, install package dependencies, and run the Vite server:

```bash
cd ../Frontend
npm install
npm run dev
```
The client app will be accessible at `http://localhost:5173`.
