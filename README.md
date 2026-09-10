# House of Leaders AI Multi-Agent Chat MVP

## 1. Overview

This repository contains an AI Multi-Agent Chat MVP developed as a technical assignment for House of Leaders.

The application provides **one seamless chat interface** powered invisibly by two specialized internal AI agents:
- **Manager**: Acts as the intelligent frontline router. Every user question goes to the Manager first. The Manager determines whether the question can be answered directly or requires information from the provided documents.
- **Specialist**: Acts as the domain expert. It is only invoked when the Manager routes the question as `SPECIALIST`. It retrieves specific facts from the provided House of Leaders knowledge base to formulate its answer.

Users **never manually choose** which agent to speak with; the system handles routing autonomously. Every response clearly indicates which agent answered the query and displays the **actual token usage metrics**. Behind the scenes, all conversations, individual messages, and actual token usage metrics are persistently stored in a Supabase database.

---

## 2. System Flow

```text
User
  ↓
Manager
  ├── DIRECT
  │     ↓
  │   Manager answers
  │
  └── SPECIALIST
        ↓
      Retrieval
        ↓
      Specialist
        ↓
      Answer
```

---

## 3. Core Features & Architecture

- **Autonomous Routing**: Fast, cost-efficient decision-making by the Manager utilizing Gemini Structured Outputs (`responseSchema`).
- **Dynamic Retrieval (RAG)**: The Specialist agent extracts relevant context from a curated House of Leaders Markdown knowledge base (`documents/house-of-leaders.md`) using the `gemini-embedding-2` vector embedding model.
- **Out-of-Document Protection**: The Specialist is explicitly instructed to refuse to hallucinate or invent answers if the requested information is absent from the provided knowledge base (e.g., private financial metrics).
- **Actual Token Tracking**: Uses token counts reported by Gemini usage metadata directly from the API payload, avoiding manual estimations.
- **Database Persistence**: Server-side Supabase integration archives all chat logs, agent roles, and token metrics.
- **Modern Chat Interface**: A clean, responsive UI built with Tailwind CSS v4 that natively renders Markdown styling for a polished user experience.

---

## 4. Token Optimization & Retrieval

Token consumption is actively minimized using the following measured strategies:
- Both agents utilize the lightweight **`gemini-3.5-flash-lite`** model, which avoids expensive background "chain-of-thought" reasoning that is unnecessary for these specific concise tasks.
- **Conditional Invocation**: The Specialist and its heavy document context are only invoked when absolutely necessary.
- **Bounded History**: The system only passes the last 5 messages to the API, preventing infinite context scaling.
- **Top-K Retrieval**: The vector search pulls the top 2 most relevant document chunks (`TOP_K = 2`), balancing token efficiency and retrieval correctness without causing unnecessary context growth.

**Measured Token Benchmark Results:**
- Manager-only average: **169.0 tokens/request**
- Specialist average: **465.3 tokens/request**
- Overall 5-test average: **406.0 tokens/request**

*(Note: These are measured results from the final five-query audit and can vary depending on the specific query and the volume of retrieved context.)*

---

## 5. Correctness & Testing

The system was verified against the following actual tested scenarios:
1. **General question** → Manager routed correctly without document retrieval.
2. **Document question** → Specialist invoked and provided correct organizational facts.
3. **Paraphrased document question** → Specialist successfully matched semantic intent via embeddings.
4. **Multi-fact document question** → Specialist successfully synthesized information.
5. **Out-of-document question** → Specialist explicitly refused to hallucinate private data (no hallucination).
6. **First-request retrieval consistency** → A lazy-initialization race condition in the retrieval cache was identified and fixed using a shared initialization Promise.
7. **Actual Gemini token metadata** → Confirmed that UI tracks the aggregated usage directly from Google's API payload.
8. **Supabase persistence** → Verified conversation and token metrics reach the database.
9. **Build** → Passed `npm run build`.

---

## 6. Known Limitations

As a focused MVP assignment, the application currently has the following known boundaries:
- The browser chat state is not restored after a refresh (though backend conversation/message data is properly persisted in Supabase).
- Authentication, an admin dashboard, a document upload UI, voice functionality, and advanced analytics are intentionally outside this MVP scope.

---

## 7. Security

- **`GEMINI_API_KEY`** is accessed strictly server-side.
- **`SUPABASE_SERVICE_ROLE_KEY`** is kept server-side only for secure database insertion.
- The `.env.local` file must **not** be committed to version control.
- Secrets and credentials must never be hardcoded in the source code.

---

## 8. Getting Started & Deployment

**Local Development:**

```bash
git clone https://github.com/Hadevs27/sistemchat.git
cd sistemchat
npm install
npm run dev
```
Before running locally, ensure you have created a `.env.local` file containing the necessary environment variables.

**Vercel Deployment:**

To deploy this Next.js App Router project to Vercel:
1. Import the repository into your Vercel dashboard.
2. Add the following environment variables in the Vercel project settings:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Click Deploy. Vercel will automatically build and host the application seamlessly.
