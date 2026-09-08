# Skim : RAG PDF Chat

> A full-stack Retrieval-Augmented Generation (RAG) application for conversational question-answering over PDF documents.

**RAG PDF Chat** lets users upload PDF documents and interact with them through a conversational AI interface. The application processes uploaded documents, indexes their content for semantic retrieval, and uses retrieved context to generate grounded answers with an LLM.

**Live Demo:** [skim.chitua.site](https://skim.chitua.site/)

<p align="center"> <img src="./client/public/og-image.png" alt="RAG PDF Chat" width="100%" /> </p>

## Overview

Traditional LLM applications rely primarily on a model's pretrained knowledge. That approach breaks down when users need answers from **private, domain-specific, or previously unseen documents**.

RAG PDF Chat addresses this by implementing a complete document-to-answer pipeline:

```text
                    ┌─────────────────────┐
                    │     PDF Upload      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  PDF Text Extraction│
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Text Chunking     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Embedding Generation│
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Qdrant Vector DB  │
                    └──────────┬──────────┘
                               │
                               │
                     User Question
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Query Embedding    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Semantic Retrieval  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Retrieved Context   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Gemini LLM       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Grounded Answer    │
                    └─────────────────────┘
```

The key idea is simple:

**retrieve the relevant information first, then ask the model to reason over that information.**

---

## Key Features

### 📄 PDF Document Processing

* Upload PDF documents through the web application
* Extract text from uploaded documents
* Process documents into retrieval-ready chunks
* Persist document-related application data

### 🔎 Semantic Retrieval

Documents are transformed into vector representations and stored in **Qdrant**.

When a user asks a question, the query is embedded and used to retrieve semantically relevant document chunks rather than relying only on keyword matching.

### 🤖 Context-Grounded Generation

Retrieved document context is supplied to the Gemini model alongside the user's question.

This allows the application to generate answers based on the contents of the uploaded documents instead of treating every question as a general-purpose LLM query.

### 💬 Conversational UI

A dedicated chat interface allows users to ask follow-up questions and interact naturally with their uploaded documents.

### 🗄️ Persistent Data Layer

MongoDB is used for application-level persistence while Qdrant handles vector-based retrieval.

This separates **structured application data** from **semantic search data**.

### 🛡️ API Validation & Protection

The backend includes:

* Request validation with Zod
* Rate limiting
* CORS configuration
* Centralized middleware
* Structured service and route separation

### ⚡ Modern Full-Stack Architecture

The application is split into independently organized frontend and backend layers:

```text
React + TypeScript
        │
        │ HTTP / REST
        ▼
Express API
        │
        ├──────────────► MongoDB
        │
        ├──────────────► Qdrant
        │
        └──────────────► Gemini
```

---

## Tech Stack

### Frontend

| Technology   | Purpose                     |
| ------------ | --------------------------- |
| React 19     | UI                          |
| TypeScript   | Type safety                 |
| Vite         | Development & build tooling |
| React Router | Client-side routing         |
| Tailwind CSS | Styling                     |
| shadcn/ui    | UI components               |
| Lucide       | Icons                       |
| Axios        | API communication           |

### Backend

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| Node.js            | Runtime                    |
| Express 5          | REST API                   |
| Zod                | Request validation         |
| Multer             | File uploads               |
| express-rate-limit | API rate limiting          |
| CORS               | Cross-origin configuration |

### AI & Data

| Technology    | Purpose                              |
| ------------- | ------------------------------------ |
| Google Gemini | LLM generation                       |
| Qdrant        | Vector database / semantic retrieval |
| MongoDB       | Application persistence              |
| pdf-parse     | PDF text extraction                  |

---

## RAG Pipeline

The application separates **document ingestion** from **question answering**.

### 1. Document Ingestion

When a user uploads a PDF:

```text
PDF
 │
 ▼
Text Extraction
 │
 ▼
Chunking
 │
 ▼
Embeddings
 │
 ▼
Qdrant
```

The document is converted from an unstructured PDF into searchable vector data.

### 2. Query Processing

When a user asks a question:

```text
Question
   │
   ▼
Query Embedding
   │
   ▼
Vector Similarity Search
   │
   ▼
Relevant Chunks
   │
   ▼
Context Construction
   │
   ▼
Gemini
   │
   ▼
Answer
```

This two-stage architecture is the core of the application.

Instead of sending an entire PDF to the model, the system retrieves the most relevant information and uses that smaller context window for generation.

---

## Architecture

The repository follows a client-server architecture:

```text
rag-pdf-chat/
│
├── client/
│   ├── public/
│   ├── src/
│   ├── components.json
│   ├── eslint.config.js
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
│
├── server/
│   ├── config/
│   ├── constants/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── eslint.config.mjs
│   ├── index.js
│   └── package.json
│
├── .gitignore
├── .prettierrc
└── package-lock.json
```

The backend is further divided by responsibility rather than placing application logic in a single server file.

### Backend responsibilities

**Routes**

Define API endpoints and coordinate requests.

**Services**

Contain application and AI-related business logic.

**Models**

Represent persisted application data.

**Validators**

Define and enforce request schemas.

**Middleware**

Handle cross-cutting concerns such as rate limiting and request processing.

**Config**

Centralize environment and application configuration.

**Utils**

Contain reusable supporting functionality.

This structure makes the backend easier to reason about and extend as the RAG pipeline grows.

---

## Project Structure

### Client

```text
client/src/
├── components/      # Reusable UI components
├── pages/            # Application pages
├── hooks/            # Reusable React hooks
├── lib/              # Client utilities
└── ...
```

The frontend is responsible for presentation, navigation, user interaction, document upload, and communication with the backend API.

### Server

```text
server/
├── config/           # Application configuration
├── constants/        # Shared constants
├── middleware/       # Express middleware
├── models/           # Database models
├── routes/           # API routes
├── scripts/          # Utility / setup scripts
├── services/         # Business & AI logic
├── utils/            # Shared utilities
└── validators/       # Request validation
```

---

## Getting Started

### Prerequisites

Install the following before running the application:

* Node.js 20+
* npm
* MongoDB
* Qdrant
* Google Gemini API key

---

### 1. Clone the repository

```bash
git clone https://github.com/SourabhRavi/rag-pdf-chat.git
cd rag-pdf-chat
```

### 2. Install dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

---

### 3. Configure environment variables

Create the required environment files and configure your database, vector store, and Gemini credentials.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key

QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
```

> Use the exact environment variable names expected by the current server configuration.

Never commit secrets or environment files containing credentials.

---

### 4. Start the backend

```bash
cd server
node index.js
```

---

### 5. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will display the local development URL.

---

## Development Commands

### Frontend

Start the development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

### Backend

Start the Express API:

```bash
node index.js
```

---

## API Architecture

The backend exposes REST endpoints consumed by the React client.

The request flow follows:

```text
Client
  │
  ▼
Express Route
  │
  ▼
Validation Middleware
  │
  ▼
Service Layer
  │
  ├── MongoDB
  ├── Qdrant
  └── Gemini
  │
  ▼
JSON Response
  │
  ▼
React Client
```

Keeping the service layer separate from route definitions prevents HTTP concerns from becoming tightly coupled to RAG and database logic.

---

## Engineering Decisions

### Why RAG?

Passing entire documents directly to an LLM is inefficient and becomes impractical as document size increases.

RAG reduces the amount of information sent to the model by retrieving only the most relevant sections.

### Why a Vector Database?

Traditional keyword search can miss semantically related content.

Vector search allows queries and document chunks to be compared based on semantic similarity.

### Why Qdrant?

Qdrant provides purpose-built vector storage and similarity search capabilities, making it a natural fit for the retrieval layer.

### Why MongoDB + Qdrant?

The two databases solve different problems:

```text
MongoDB
   │
   └── Application / structured data

Qdrant
   │
   └── Embeddings / semantic retrieval
```

Using each database for its intended workload keeps the architecture clearer than forcing both use cases into a single datastore.

### Why a Separate Service Layer?

AI workflows involve multiple external systems and processing steps.

Keeping this logic inside dedicated services makes the API layer thinner and allows individual pieces of the RAG pipeline to evolve independently.

---

## Security & Reliability

The backend incorporates several safeguards expected in a real API application:

* Schema validation with Zod
* Rate limiting to reduce API abuse
* CORS configuration
* Environment-based secret management
* Dedicated middleware
* Separation of API routes and business logic

> This project is intended as a portfolio and engineering project; production deployment should additionally include infrastructure-level security, authentication, monitoring, secret management, and appropriate resource limits.

---

## Deployment

The frontend is configured for deployment on **Vercel**.

The application requires the backend, MongoDB, Qdrant, and Gemini credentials to be configured appropriately for the deployment environment.

For production deployments, the frontend should point to the deployed backend API rather than a local development server.

---

## What This Project Demonstrates

This project was built to explore the engineering challenges involved in building an AI application beyond simply calling an LLM API.

It demonstrates experience with:

* Full-stack application architecture
* React + TypeScript development
* REST API design
* PDF ingestion and processing
* Retrieval-Augmented Generation
* Embeddings and semantic search
* Vector databases
* LLM integration
* MongoDB persistence
* API validation
* Rate limiting
* Environment-based configuration
* Modular backend architecture
* Production-oriented frontend tooling

---

## Author

**Sourabh Ravi**

Full-stack developer interested in building AI-powered products and scalable web applications.

[GitHub](https://github.com/SourabhRavi)

---

<p align="center">
  <strong>RAG PDF Chat</strong><br>
  Turning static documents into searchable, conversational knowledge.
</p>
