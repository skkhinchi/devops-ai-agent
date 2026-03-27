# 🚀 DevOps AI Agent

An **AI-powered repository understanding and DevOps assistant** built using **FastAPI, LangChain, OpenAI, and RAG (Retrieval-Augmented Generation)**.

This project is designed to help developers and DevOps engineers:

* analyze repositories
* understand project architecture
* ask questions about codebases
* generate AI-based repo summaries
* later extend into a more advanced engineering / DevOps assistant

---

## 📌 Features

### ✅ Implemented (Day 1 + Day 2)

* Repository file analyzer
* LangChain integration
* OpenAI integration
* Code chunking
* Embeddings generation
* Chroma vector database
* Repository Q&A
* AI-powered repo summary
* Strict grounded answering (reduced hallucination)

### 🚧 Planned

* Local repo auto-loader
* GitHub repo ingestion
* Dependency graph analysis
* PR review agent
* Code explanation assistant
* Architecture visualization
* DevOps workflow intelligence

---

# 🧠 What This Project Does

This system allows you to **index a code repository into a vector database** and then ask questions about it using AI.

Instead of sending the entire codebase to the LLM every time, the project uses **RAG**:

1. Read repository files
2. Split code into chunks
3. Convert chunks into embeddings
4. Store them in a vector database
5. Retrieve only relevant chunks for a question
6. Ask the LLM to answer using only those chunks

This makes the system:

* faster
* cheaper
* more scalable
* more accurate

---

# 🏗️ Architecture

```text id="2d7e95"
Repository Files
      ↓
Repository Analyzer
      ↓
Structured File Data
      ↓
Chunking
      ↓
Embeddings
      ↓
Vector DB (Chroma)
      ↓
Retriever
      ↓
OpenAI LLM
      ↓
Answer / Summary
```

---

# 📅 Progress So Far

---

## ✅ Day 1 — Repository Analyzer Foundation

### Objective

Build the base backend layer that can read repository files.

### What was done

* Read repository files
* Extract file paths and file content
* Prepare structured input for AI processing

### Why it matters

AI cannot answer repository questions unless the codebase is first converted into structured input.

---

## ✅ Day 2 — LangChain + OpenAI + RAG Setup

### Objective

Convert the repository analyzer into an AI-powered repository understanding system.

### What was done

* LangChain setup
* OpenAI setup
* Chunking implementation
* Embeddings generation
* Chroma vector DB integration
* Retriever setup
* Repo Q&A endpoint
* AI Summary endpoint
* Strict prompt grounding to reduce hallucination

---

# 🛠️ Tech Stack

* **Backend**: FastAPI
* **AI Framework**: LangChain
* **LLM**: OpenAI (`gpt-4o-mini`)
* **Embeddings**: OpenAI Embeddings
* **Vector DB**: ChromaDB
* **Language**: Python
* **Environment Management**: `venv`
* **Config Management**: `python-dotenv`

---

# 📁 Project Structure

```bash id="sjv7iv"
backend/
│
├── app/
│   ├── main.py
│   ├── routes/
│   │   └── ai.py
│   ├── services/
│   │   └── rag_service.py
│   └── utils/
│
├── chroma_db/
├── .env
├── requirements.txt
└── venv/
```

---

# 📄 Key Files

## `app/main.py`

Main FastAPI application entry point.

### Responsibilities

* starts the backend
* registers routes
* exposes APIs

---

## `app/routes/ai.py`

Contains the AI-related API endpoints.

### Responsibilities

* load repository files into vector DB
* ask repo questions
* generate repo summary

---

## `app/services/rag_service.py`

Core AI logic of the project.

### Responsibilities

* split documents into chunks
* generate embeddings
* store vectors in Chroma
* retrieve relevant chunks
* ask the LLM
* generate repo answers and summaries

---

# ⚙️ Setup Instructions

## 1. Clone the repository

```bash id="oqnjyv"
git clone <your-repo-url>
cd backend
```

---

## 2. Create virtual environment

### macOS / Linux

```bash id="76qpdx"
python3 -m venv venv
source venv/bin/activate
```

---

## 3. Install dependencies

```bash id="vchlk7"
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If needed, install manually:

```bash id="vlgx3g"
python -m pip install fastapi uvicorn python-dotenv langchain langchain-openai langchain-community langchain-chroma chromadb tiktoken pydantic
```

---

## 4. Create `.env` file

Create a `.env` file in the backend root:

```env id="w4ijw2"
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 5. Run the backend

```bash id="o9ahkn"
uvicorn app.main:app --reload
```

Server will run at:

```text id="u6s13r"
http://127.0.0.1:8000
```

Swagger docs:

```text id="7c73ch"
http://127.0.0.1:8000/docs
```

---

# 📡 API Endpoints

---

## 1. Load Repository into Vector DB

### Endpoint

```http id="h5v3v8"
POST /ai/load-repo
```

### Description

Loads repository files into the vector database.

### Example Request

```json id="9jjqtp"
{
  "files": [
    {
      "path": "app/main.py",
      "content": "from fastapi import FastAPI\napp = FastAPI()"
    },
    {
      "path": "README.md",
      "content": "# DevOps AI Agent\nThis project analyzes repositories."
    }
  ]
}
```

### Example Response

```json id="6h4z4n"
{
  "message": "Repository indexed successfully",
  "chunks": 2
}
```

---

## 2. Ask Questions About the Repo

### Endpoint

```http id="gl7zwi"
POST /ai/ask
```

### Description

Ask repository-related questions.

### Example Request

```json id="94cmq8"
{
  "question": "What does this project do?"
}
```

### Example Response

```json id="nbg3zx"
{
  "answer": "This project appears to be a DevOps AI Agent backend...",
  "sources": [
    "README.md",
    "app/main.py"
  ]
}
```

---

## 3. Generate AI Repo Summary

### Endpoint

```http id="9f33ej"
GET /ai/summary
```

### Description

Generate a structured summary of the indexed repository.

### Example Response

```json id="p8m61w"
{
  "summary": "This repository appears to be the early backend setup for a DevOps AI Agent..."
}
```

---

# 🧪 Verification Done

The current implementation has been tested for:

* successful indexing
* repo Q&A
* repo summary generation
* strict grounded answering

### Example verified behavior

```json id="5r70s6"
{
  "answer": "I could not find that in the indexed repository.",
  "sources": [
    "app/main.py",
    "README.md"
  ]
}
```

### Why this matters

This confirms the AI is not blindly hallucinating and is properly grounded in indexed repository content.

---

# 🔍 How RAG Works in This Project

## Step 1 — Repository Files

The repository analyzer reads files and prepares structured input.

## Step 2 — Chunking

Large files are split into smaller chunks for efficient search and prompt control.

## Step 3 — Embeddings

Chunks are converted into semantic vectors using OpenAI embeddings.

## Step 4 — Vector Storage

Embeddings and metadata are stored in ChromaDB.

## Step 5 — Retrieval

When the user asks a question, the most relevant chunks are retrieved.

## Step 6 — Answer Generation

The retrieved context is passed to the LLM to generate an answer grounded in repository data.

---

# 🚨 Current Limitation

At the current stage, repository files are still being loaded manually via JSON payloads:

```json id="67tzkl"
{
  "files": [...]
}
```

This works for testing, but is not ideal for production usage.

---

# 🚀 Next Roadmap

## Short-Term

* [ ] Local repo folder auto-loader
* [ ] Ignore unnecessary folders (`.git`, `node_modules`, `dist`, `build`, `venv`)
* [ ] Auto-index local repositories
* [ ] Better file filtering
* [ ] Improved repo summarization

## Mid-Term

* [ ] GitHub repo ingestion
* [ ] Dependency graph extraction
* [ ] Architecture-aware retrieval
* [ ] Multi-file reasoning

## Long-Term

* [ ] PR Review Agent
* [ ] Bug Investigation Assistant
* [ ] Code Explanation Assistant
* [ ] DevOps Workflow AI
* [ ] CI/CD intelligence assistant

---

# 🎯 Current Status

## Day 1

✅ Repository Analyzer ready

## Day 2

✅ LangChain integrated
✅ OpenAI integrated
✅ Chunking implemented
✅ Embeddings implemented
✅ Vector DB setup completed
✅ Repo Q&A working
✅ AI Summary working
✅ Hallucination reduced with strict prompting

---

# 🔥 Long-Term Vision

This project is intended to evolve into an **AI engineering / DevOps assistant** capable of helping with:

* code understanding
* repo exploration
* developer onboarding
* architecture analysis
* debugging workflows
* DevOps automation support

---

# 👨‍💻 Author

Built as part of a hands-on learning journey to understand:

* AI engineering
* RAG systems
* LangChain workflows
* practical LLM integration in developer tools

---

# ⭐ Future Improvements

Some high-value future additions:

* UI dashboard for repo chat
* GitHub OAuth + repo import
* semantic code search
* AI-generated architecture docs
* deployment support
* observability / tracing for AI calls

---

# 📌 Summary

This project currently provides the foundation of an **AI-powered repository assistant**.

### So far, it can:

* read repository data
* store repository knowledge in a vector database
* answer repo-specific questions
* generate AI summaries

This is the starting point for building a much more powerful **DevOps AI Agent**.

---
