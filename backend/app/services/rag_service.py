
import os
from dotenv import load_dotenv
import langsmith as ls

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.documents import Document

load_dotenv()


class RAGService:
    def __init__(self):
        self.persist_directory = "./chroma_db"
        self.embeddings = OpenAIEmbeddings()
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0
        )
        self.vectorstore = None

    def split_documents(self, repo_files: list[dict]):
        documents = []

        for file in repo_files:
            path = file.get("path", "")
            content = file.get("content", "")

            if not content.strip():
                continue

            documents.append(
                Document(
                    page_content=content,
                    metadata={"path": path}
                )
            )

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1200,
            chunk_overlap=200
        )

        return splitter.split_documents(documents)

    @ls.traceable(name="Ingest Repository", run_type="chain")
    def ingest_repo(self, repo_files: list[dict]):
        chunks = self.split_documents(repo_files)

        if not chunks:
            return {"message": "No valid files found for embedding", "chunks": 0}

        self.vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=self.persist_directory
        )

        return {
            "message": "Repository indexed successfully",
            "chunks": len(chunks)
        }

    def load_existing_db(self):
        if os.path.exists(self.persist_directory):
            self.vectorstore = Chroma(
                persist_directory=self.persist_directory,
                embedding_function=self.embeddings
            )

    @ls.traceable(name="Ask Repo", run_type="chain")
    def ask_repo(self, question: str):
        if not self.vectorstore:
            self.load_existing_db()

        if not self.vectorstore:
            return {
                "answer": "Repository is not indexed yet. Please load the repo first.",
                "sources": []
            }

        retriever = self.vectorstore.as_retriever(search_kwargs={"k": 5})
        docs = retriever.invoke(question)

        if not docs:
            return {
                "answer": "I could not find that in the indexed repository.",
                "sources": []
            }

        context = "\n\n".join(
            [f"FILE: {doc.metadata.get('path', 'unknown')}\n{doc.page_content}" for doc in docs]
        )

        prompt = f"""
You are a strict repository Q&A assistant.

IMPORTANT RULES:
- Answer ONLY from the repository context provided below.
- DO NOT assume, infer, or guess anything not explicitly present.
- If the answer is not clearly available in the context, say exactly:
"I could not find that in the indexed repository."
- Mention relevant files only if they are actually present in the context.
- Keep the answer concise and developer-friendly.

Repository Context:
{context}

User Question:
{question}
"""

        response = self.llm.invoke(prompt)

        return {
            "answer": response.content,
            "sources": list({doc.metadata.get("path", "unknown") for doc in docs})
        }

    @ls.traceable(name="Generate Repo Summary", run_type="chain")
    def generate_repo_summary(self):
        if not self.vectorstore:
            self.load_existing_db()

        if not self.vectorstore:
            return {"summary": "Repository is not indexed yet."}

        docs = self.vectorstore.similarity_search(
            "project architecture tech stack modules",
            k=10
        )

        if not docs:
            return {"summary": "Not enough repository context is indexed yet."}

        context = "\n\n".join(
            [f"FILE: {doc.metadata.get('path', 'unknown')}\n{doc.page_content}" for doc in docs]
        )

        prompt = f"""
You are a strict codebase summarizer.

IMPORTANT RULES:
- Summarize ONLY what is explicitly present in the repository context.
- DO NOT assume missing architecture, modules, APIs, CI/CD, databases, or workflows.
- If something is not visible in the context, say "Not enough information available."
- Do NOT invent features or implementation details.
- Keep the summary structured and grounded in the provided files only.

Provide the summary in this format:

1. Project purpose
2. Tech stack
3. Folder/module structure
4. Key files and what they do
5. What is unclear / missing from the indexed context

Repository Context:
{context}
"""

        response = self.llm.invoke(prompt)

        return {"summary": response.content}
