# Product Requirements Document (PRD)

# AI Multi-Agent Chat System

**Version:** 1.0
**Status:** MVP / Technical Assignment
**Target:** Technical Assessment
**Deadline:** 11 September 2026, 12:00 WIB

---

# 1. Product Overview

## 1.1 Nama Produk

**AI Multi-Agent Chat System**

Sebuah aplikasi chatbot berbasis web yang memungkinkan user berinteraksi melalui satu interface chat, sementara sistem secara internal menggunakan dua AI agent:

1. **Manager**
2. **Specialist**

User tidak perlu mengetahui bahwa terdapat dua agent di belakang sistem.

Manager bertugas menerima seluruh pertanyaan user dan menentukan apakah pertanyaan:

* dapat dijawab langsung tanpa membaca dokumen, atau
* membutuhkan informasi dari dokumen sehingga harus diteruskan kepada Specialist.

Specialist hanya dipanggil ketika dibutuhkan dan bertugas mencari informasi yang relevan dari dokumen lalu menghasilkan jawaban berdasarkan informasi tersebut.

---

# 2. Background

Sistem ini dibuat sebagai technical assignment yang berfokus pada kemampuan untuk:

* merancang sistem AI multi-agent sederhana;
* membuat routing antar-agent;
* mengintegrasikan AI API;
* menggunakan dokumen sebagai knowledge source;
* mengontrol konsumsi token;
* mencatat penggunaan token;
* melakukan pengujian kualitas jawaban;
* membuat aplikasi yang dapat digunakan secara nyata melalui deployment.

Prioritas utama sistem bukan jumlah fitur, tetapi:

> **Sederhana, berjalan, hemat token, dapat diuji, dan keputusan teknisnya dapat dijelaskan.**

---

# 3. Problem Statement

Sistem chatbot biasa dapat langsung mengirim seluruh pertanyaan user ke model AI yang menangani seluruh tugas.

Pendekatan tersebut memiliki beberapa masalah:

1. Semua pertanyaan menggunakan model yang sama meskipun tidak semuanya membutuhkan kemampuan yang sama.
2. Pertanyaan sederhana dapat menyebabkan penggunaan token yang tidak perlu.
3. Pertanyaan terkait dokumen membutuhkan mekanisme retrieval agar model dapat memberikan jawaban berdasarkan sumber.
4. Sulit mengetahui agent mana yang menjawab.
5. Sulit melakukan evaluasi biaya/token per pertanyaan.

Sistem ini menyelesaikan masalah tersebut dengan memisahkan tanggung jawab menjadi dua agent.

---

# 4. Goals

## 4.1 Primary Goals

Sistem harus:

* menyediakan satu interface chat untuk user;
* memiliki dua AI agent: Manager dan Specialist;
* membuat Manager menerima seluruh pertanyaan;
* membuat Manager menentukan routing;
* membuat Manager menjawab pertanyaan sederhana secara langsung;
* membuat Manager meneruskan pertanyaan document-related kepada Specialist;
* membuat Specialist menggunakan dokumen sebagai knowledge source;
* menampilkan agent yang menghasilkan jawaban;
* menampilkan jumlah token yang digunakan;
* menyimpan token usage ke database;
* menyimpan riwayat percakapan;
* meminimalkan penggunaan token;
* dapat di-deploy dan digunakan melalui browser.

## 4.2 Secondary Goals

Sistem juga diharapkan:

* memiliki struktur kode yang mudah dipahami;
* memiliki environment configuration yang aman;
* memiliki dokumentasi setup;
* memiliki test cases;
* dapat menunjukkan perbandingan penggunaan token sebelum dan sesudah optimasi.

---

# 5. Non-Goals

Fitur berikut tidak menjadi prioritas MVP:

* authentication/login;
* multi-user account management;
* role-based access control;
* admin dashboard;
* upload dokumen melalui UI;
* file management kompleks;
* voice input;
* image input;
* streaming yang kompleks;
* real-time collaboration;
* analytics dashboard yang lengkap;
* notification;
* billing system;
* production-grade enterprise security;
* multi-document management yang kompleks.

Fitur-fitur tersebut hanya boleh ditambahkan jika core requirement telah selesai.

---

# 6. Product Scope

## 6.1 MVP Scope

MVP terdiri dari:

### Frontend

* satu halaman chat;
* message history;
* input message;
* send button;
* loading state;
* error state;
* agent badge;
* token usage badge.

### Backend

* chat endpoint;
* Manager agent;
* Specialist agent;
* routing logic;
* document retrieval;
* AI response generation;
* token usage extraction;
* database logging.

### Database

* conversations;
* messages;
* token usage.

### Knowledge Base

* minimal satu dokumen;
* document chunking;
* retrieval terhadap chunk relevan.

### Deployment

* GitHub repository;
* Vercel deployment;
* Supabase project;
* AI API integration.

---

# 7. Technology Stack

## 7.1 Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## 7.2 Backend

* Next.js Route Handler / server-side API
* TypeScript

## 7.3 Database

* Supabase PostgreSQL

## 7.4 AI Provider

* Google Gemini API

AI provider harus diakses melalui backend/server-side application.

API key tidak boleh dikirim ke browser.

## 7.5 Deployment

* Vercel

## 7.6 Source Control

* GitHub

---

# 8. High-Level Architecture

```text
                         ┌─────────────────────┐
                         │        USER         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     CHAT FRONTEND   │
                         │       Next.js       │
                         └──────────┬──────────┘
                                    │
                                    │ POST /api/chat
                                    ▼
                         ┌─────────────────────┐
                         │       MANAGER       │
                         │    AI Router Agent  │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                    DIRECT                   SPECIALIST
                         │                     │
                         ▼                     ▼
                  Manager Answer       ┌───────────────┐
                                       │  RETRIEVAL    │
                                       │ Document KB   │
                                       └───────┬───────┘
                                               │
                                               ▼
                                       Relevant Chunks
                                               │
                                               ▼
                                       ┌───────────────┐
                                       │  SPECIALIST   │
                                       │  AI Agent     │
                                       └───────┬───────┘
                                               │
                         ┌─────────────────────┘
                         │
                         ▼
                  Final Answer
                         │
                         ▼
                ┌─────────────────┐
                │    SUPABASE     │
                │ Message + Token │
                │     Logging     │
                └────────┬────────┘
                         │
                         ▼
                       USER
```

---

# 9. Core Concept: Two Agents

## 9.1 Manager Agent

Manager merupakan agent pertama dan entry point seluruh pertanyaan.

### Responsibility

Manager:

1. menerima user message;
2. memahami intent dasar;
3. menentukan apakah document knowledge diperlukan;
4. memilih:

   * `DIRECT`
   * `SPECIALIST`
5. jika `DIRECT`, menghasilkan jawaban;
6. jika `SPECIALIST`, tidak menjawab sendiri dan meneruskan request ke Specialist.

### Manager tidak bertugas untuk

* melakukan document retrieval;
* membaca seluruh knowledge base;
* mengarang informasi internal;
* selalu memanggil Specialist.

---

# 10. Specialist Agent

Specialist merupakan agent kedua.

Specialist hanya dipanggil jika Manager menentukan bahwa pertanyaan membutuhkan document knowledge.

### Responsibility

Specialist:

1. menerima pertanyaan dari Manager;
2. melakukan retrieval terhadap knowledge base;
3. mengambil chunk dokumen yang relevan;
4. menggunakan chunk tersebut sebagai context;
5. menghasilkan jawaban berdasarkan context;
6. menghindari hallucination jika informasi tidak tersedia.

### Specialist tidak bertugas untuk

* menerima seluruh request user secara langsung;
* menggantikan fungsi routing Manager;
* menganggap informasi yang tidak ada di dokumen sebagai fakta internal.

---

# 11. Manager Routing Logic

Manager harus memilih salah satu dari dua route:

```text
DIRECT
SPECIALIST
```

## 11.1 DIRECT

Gunakan `DIRECT` ketika pertanyaan dapat dijawab tanpa membutuhkan informasi dari dokumen internal.

Contoh:

> Apa itu Next.js?

Route:

```text
DIRECT
```

Contoh:

> Apa perbedaan frontend dan backend?

Route:

```text
DIRECT
```

Contoh:

> Berapa 10 + 25?

Route:

```text
DIRECT
```

---

# 12. SPECIALIST

Gunakan `SPECIALIST` ketika pertanyaan membutuhkan informasi yang kemungkinan berada di dokumen internal.

Contoh:

> Berapa hari cuti tahunan menurut handbook?

Route:

```text
SPECIALIST
```

Contoh:

> Berdasarkan SOP QC, apa tindakan untuk defect critical?

Route:

```text
SPECIALIST
```

Contoh:

> Apa prosedur approval inspection yang ada di dokumen?

Route:

```text
SPECIALIST
```

---

# 13. Routing Principle

Prinsip utama Manager:

> **Panggil Specialist hanya jika document knowledge diperlukan.**

Jangan menggunakan Specialist untuk semua pertanyaan.

Contoh:

```text
100 user questions
        │
        ▼
     Manager
        │
        ├── 75 DIRECT
        │
        └── 25 SPECIALIST
```

Dengan pendekatan tersebut, sistem menghindari pemanggilan Specialist yang tidak diperlukan.

---

# 14. Manager Output

Manager harus menghasilkan keputusan terstruktur.

Contoh:

```json
{
  "route": "DIRECT"
}
```

atau:

```json
{
  "route": "SPECIALIST"
}
```

Penggunaan structured output lebih disarankan daripada mengandalkan parsing teks bebas.

---

# 15. End-to-End Application Flow

## 15.1 Flow A — User Opens Application

```text
User membuka URL Vercel
        │
        ▼
Next.js render Chat UI
        │
        ▼
User melihat input chat
```

Tidak diperlukan login pada MVP.

---

# 16. Flow B — User Sends Message

Misalnya:

> Apa itu Next.js?

Flow:

```text
User
  │
  ▼
Chat UI
  │
  ▼
POST /api/chat
  │
  ▼
Validate request
  │
  ▼
Save user message
  │
  ▼
Manager Agent
```

Manager menentukan:

```text
DIRECT
```

Kemudian:

```text
Manager generates answer
        │
        ▼
Extract token usage
        │
        ▼
Save assistant message
        │
        ▼
Return response
        │
        ▼
Frontend displays:

Manager · XX tokens
```

---

# 17. Flow C — Document Question

User:

> Berapa hari cuti tahunan menurut handbook?

Flow:

```text
User
  │
  ▼
Chat UI
  │
  ▼
POST /api/chat
  │
  ▼
Save user message
  │
  ▼
Manager
  │
  ▼
route = SPECIALIST
  │
  ▼
Retrieval
  │
  ▼
Search relevant document chunks
  │
  ▼
Top-K relevant chunks
  │
  ▼
Specialist
  │
  ▼
Answer based on retrieved context
  │
  ▼
Extract token usage
  │
  ▼
Save assistant message
  │
  ▼
Return response
  │
  ▼
Frontend displays:

Specialist · XX tokens
```

---

# 18. Flow D — Document Information Not Found

User bertanya:

> Siapa CEO perusahaan?

Jika informasi tersebut tidak terdapat dalam knowledge base:

```text
User
  │
  ▼
Manager
  │
  ▼
SPECIALIST
  │
  ▼
Retrieval
  │
  ▼
No sufficiently relevant document chunk
  │
  ▼
Specialist
  │
  ▼
"No relevant information found
 in the available document."
```

Sistem tidak boleh membuat informasi internal secara sembarangan.

---

# 19. Document Knowledge Base

## 19.1 Document

MVP menggunakan minimal satu dokumen.

Contoh:

```text
documents/
└── company-handbook.md
```

Isi dokumen dapat mencakup:

* company information;
* working hours;
* annual leave;
* quality control;
* inspection procedure;
* defect classification;
* approval workflow.

---

# 20. Document Processing Flow

```text
Original Document
       │
       ▼
Load document
       │
       ▼
Normalize text
       │
       ▼
Split into chunks
       │
       ▼
Generate embeddings / index
       │
       ▼
Store searchable representation
       │
       ▼
Ready for retrieval
```

---

# 21. Retrieval Flow

Ketika Specialist menerima pertanyaan:

```text
User question
      │
      ▼
Embedding / query representation
      │
      ▼
Similarity search
      │
      ▼
Relevant chunks
      │
      ▼
Top-K context
      │
      ▼
Specialist prompt
      │
      ▼
Answer
```

Retrieval harus membatasi jumlah context yang dikirim kepada Specialist.

Tujuannya:

> **Tidak mengirim seluruh dokumen pada setiap request.**

---

# 22. Top-K Retrieval

MVP dapat menggunakan jumlah chunk terbatas, misalnya:

```text
Top-K = 3
```

atau nilai lain yang ditentukan berdasarkan pengujian.

Nilai tersebut harus dapat diubah melalui konfigurasi bila diperlukan.

Contoh:

```text
Document:
20 chunks

User asks:
"Berapa hari cuti tahunan?"

Retrieval:
Chunk 4
Chunk 7
Chunk 9

Specialist hanya menerima
chunk yang paling relevan.
```

---

# 23. Specialist Prompt Principle

Specialist harus memiliki aturan seperti:

1. Jawab berdasarkan context yang diberikan.
2. Jangan mengarang informasi yang tidak terdapat di context.
3. Jika context tidak cukup, katakan bahwa informasi tidak ditemukan.
4. Gunakan jawaban singkat dan relevan.
5. Jangan mengulang seluruh context.

---

# 24. Token Optimization Strategy

Token efficiency adalah salah satu requirement utama.

## 24.1 Optimization 1 — Lightweight Manager

Manager digunakan sebagai router sehingga model yang relatif ringan dapat digunakan untuk tugas routing jika hasil pengujian menunjukkan kualitas memadai.

Manager tidak perlu diberi seluruh dokumen.

---

# 25. Optimization 2 — Specialist Only When Needed

Burden utama:

```text
Semua pertanyaan
       ↓
Specialist
```

harus dihindari.

Target:

```text
Semua pertanyaan
       ↓
Manager
       ↓
 ┌─────┴─────┐
 │           │
DIRECT    SPECIALIST
```

---

# 26. Optimization 3 — Limited Retrieval Context

Jangan mengirim seluruh dokumen ke Specialist.

Gunakan:

```text
Top-K relevant chunks
```

Dengan demikian input tokens Specialist dapat dikurangi.

---

# 27. Optimization 4 — Concise Prompts

System prompts dibuat ringkas dan fokus pada responsibility agent.

Hindari prompt yang terlalu panjang.

Manager:

```text
Routing + direct answer instructions
```

Specialist:

```text
Document grounding + answer instructions
```

---

# 28. Optimization 5 — Controlled Conversation Context

Conversation history tidak boleh dikirim tanpa batas.

MVP harus memiliki strategi untuk membatasi history yang dikirim ke model.

Pendekatan awal:

* kirim sejumlah message terakhir yang relevan;
* jangan mengirim seluruh conversation tanpa batas;
* hindari duplikasi context.

---

# 29. Token Tracking

Setiap response AI harus mencatat usage.

Minimal:

```text
input_tokens
output_tokens
total_tokens
```

Contoh:

```json
{
  "inputTokens": 120,
  "outputTokens": 45,
  "totalTokens": 165
}
```

---

# 30. Token Display

Frontend harus menampilkan agent dan token usage.

Format yang direkomendasikan:

```text
Manager · 165 tokens
```

atau:

```text
Specialist · 287 tokens
```

Jika provider memberikan input/output breakdown, UI dapat menampilkannya secara opsional.

---

# 31. Conversation Storage

Setiap conversation mempunyai ID.

Contoh:

```text
conversation_id:
550e8400-e29b-41d4-a716-446655440000
```

Semua message terkait conversation tersebut menggunakan ID yang sama.

---

# 32. Database Design

## 32.1 Table: conversations

Fields:

```text
id
created_at
```

Contoh:

```sql
create table conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now()
);
```

---

# 33. Table: messages

Fields:

```text
id
conversation_id
role
agent
content
input_tokens
output_tokens
total_tokens
created_at
```

Contoh:

```sql
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id),
  role text not null,
  agent text,
  content text not null,
  input_tokens integer default 0,
  output_tokens integer default 0,
  total_tokens integer default 0,
  created_at timestamptz default now()
);
```

---

# 34. Message Roles

Role minimal:

```text
user
assistant
```

Agent dapat berupa:

```text
manager
specialist
null
```

Untuk user message:

```text
role = user
agent = null
```

Untuk Manager response:

```text
role = assistant
agent = manager
```

Untuk Specialist response:

```text
role = assistant
agent = specialist
```

---

# 35. API Design

## Endpoint

```http
POST /api/chat
```

## Request

```json
{
  "conversationId": "uuid",
  "message": "Berapa hari cuti tahunan?"
}
```

Jika conversation belum ada, backend dapat membuat conversation baru.

---

# 36. API Response

Contoh:

```json
{
  "message": "Berdasarkan dokumen perusahaan, cuti tahunan adalah 12 hari.",
  "agent": "specialist",
  "usage": {
    "inputTokens": 120,
    "outputTokens": 40,
    "totalTokens": 160
  },
  "conversationId": "uuid"
}
```

---

# 37. Backend Processing Logic

Pseudo-flow:

```text
receive request

validate message

create/reuse conversation

save user message

call Manager

if Manager route == DIRECT:
    use Manager answer
    collect token usage
    save assistant message
    return answer

if Manager route == SPECIALIST:
    retrieve relevant document chunks

    call Specialist with:
        user question
        retrieved context

    collect token usage

    save assistant message

    return answer
```

---

# 38. Error Handling

## 38.1 AI API Error

Jika provider AI gagal:

```text
Maaf, terjadi masalah saat memproses pertanyaan.
Silakan coba lagi.
```

Jangan tampilkan:

* API key;
* stack trace;
* internal error;
* environment variables.

---

# 39. Retrieval Error

Jika retrieval gagal:

```text
Maaf, sistem belum dapat mengambil informasi dari dokumen.
```

---

# 40. Empty Message

Jika user mengirim:

```text
""
```

Frontend/backend harus menolak request.

Contoh:

```text
Please enter a message.
```

---

# 41. Loading State

Saat AI sedang memproses:

```text
Manager is thinking...
```

Namun user-facing UI tidak harus menampilkan detail internal agent pipeline.

Alternatif:

```text
Thinking...
```

Ketika selesai barulah agent ditampilkan.

---

# 42. User Experience Principle

User harus merasa sedang berbicara dengan:

> **satu AI assistant**

Bukan:

> AI Manager + AI Specialist

Oleh karena itu:

* tidak ada tab Manager;
* tidak ada tab Specialist;
* tidak ada user routing control;
* tidak ada input khusus Specialist;
* user tidak memilih agent secara manual.

Agent hanya ditampilkan sebagai metadata pada jawaban.

---

# 43. UI Specification

## Header

```text
AI Assistant
```

Opsional:

```text
Multi-Agent Document Assistant
```

## Chat Area

Setiap message menampilkan:

* sender;
* message content;
* timestamp opsional;
* agent badge untuk assistant;
* token count untuk assistant.

## Input

```text
[ Type your question...                 ][ Send ]
```

---

# 44. Example UI

```text
┌─────────────────────────────────────────────┐
│ AI Assistant                                │
├─────────────────────────────────────────────┤
│                                             │
│ USER                                        │
│ Apa itu Next.js?                            │
│                                             │
│ MANAGER                                     │
│ Next.js adalah framework React...           │
│                                             │
│ Manager · 96 tokens                         │
│                                             │
│ USER                                        │
│ Berapa hari cuti tahunan?                   │
│                                             │
│ SPECIALIST                                  │
│ Berdasarkan dokumen, cuti tahunan           │
│ adalah 12 hari.                             │
│                                             │
│ Specialist · 184 tokens                     │
│                                             │
├─────────────────────────────────────────────┤
│ Type your question...              [ Send ] │
└─────────────────────────────────────────────┘
```

---

# 45. Security Requirements

## API Keys

Semua secret disimpan di environment variables.

Contoh:

```env
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

API secret tidak boleh ditulis langsung di source code.

---

# 46. GitHub Security

Repository harus memiliki:

```text
.env.example
```

tetapi tidak boleh memiliki:

```text
.env
.env.local
```

API key tidak boleh di-commit.

`.gitignore` harus memastikan environment secrets tidak masuk repository.

---

# 47. Suggested Project Structure

```text
ai-agent-chatbot/
│
├── app/
│   ├── page.tsx
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   │
│   └── components/
│       ├── Chat.tsx
│       ├── MessageBubble.tsx
│       └── TokenBadge.tsx
│
├── lib/
│   ├── supabase.ts
│   ├── manager.ts
│   ├── specialist.ts
│   ├── router.ts
│   ├── retrieval.ts
│   └── ai.ts
│
├── documents/
│   └── company-handbook.md
│
├── scripts/
│   └── ingest.ts
│
├── supabase/
│   └── schema.sql
│
├── tests/
│   └── test-cases.md
│
├── public/
│
├── .env.example
├── .gitignore
├── README.md
├── NOTES.md
├── package.json
└── tsconfig.json
```

---

# 48. Testing Strategy

Testing harus mencakup setidaknya tiga kategori.

## Test Category A — General Knowledge

Contoh:

```text
Apa itu Next.js?
```

Expected:

```text
Agent = manager
```

---

# 49. Test Category B — Document Knowledge

Contoh:

```text
Berapa hari cuti tahunan berdasarkan handbook?
```

Expected:

```text
Agent = specialist
Answer = 12 hari
```

---

# 50. Test Category C — Out-of-Document

Contoh:

```text
Siapa CEO perusahaan?
```

Jika tidak ada di dokumen:

Expected:

```text
Specialist tidak mengarang.
```

---

# 51. Additional Routing Tests

## Simple Question

```text
2 + 2 berapa?
```

Expected:

```text
DIRECT
```

## Internal Document Question

```text
Apa prosedur approval inspection?
```

Expected:

```text
SPECIALIST
```

## Ambiguous Question

```text
Bagaimana aturan perusahaan?
```

Expected:

Manager dapat memilih Specialist jika informasi tersebut kemungkinan berada dalam knowledge base.

---

# 52. Accuracy Testing

Minimal test dataset:

```text
10 general questions
10 document questions
5 out-of-document questions
```

Total:

```text
25 test cases
```

Metrik:

```text
routing accuracy
answer correctness
grounding correctness
hallucination rate
average token usage
```

---

# 53. Routing Accuracy

Rumus:

```text
Correctly Routed Questions
-------------------------- × 100
Total Questions
```

Contoh:

```text
23 / 25 × 100
= 92%
```

Angka aktual harus diperoleh dari hasil testing.

---

# 54. Token Benchmark

Sistem harus diuji dalam dua kondisi.

## Before Optimization

Contoh baseline:

```text
Semua pertanyaan menggunakan model/flow yang sama.
```

Catat:

```text
average tokens/question
total tokens
number of Specialist calls
```

## After Optimization

Catat kembali:

```text
average tokens/question
total tokens
number of Specialist calls
```

Jangan menggunakan angka contoh pada laporan final.

Gunakan angka hasil pengujian nyata.

---

# 55. Token Optimization Report

Format:

```text
Metric                  Before      After
------------------------------------------------
Average tokens          XXX         XXX
Total tokens            XXX         XXX
Specialist calls        XXX         XXX
Routing accuracy        XXX%        XXX%
```

Persentase penghematan:

```text
(Before - After)
---------------- × 100
Before
```

---

# 56. Accuracy Preservation

Optimasi token tidak boleh dilakukan hanya untuk menurunkan angka token.

Sistem tetap harus:

* memberikan routing yang benar;
* memberikan jawaban yang benar;
* tetap grounded pada dokumen;
* tidak meningkatkan hallucination secara signifikan.

Prinsip:

> **Token lebih sedikit tidak dianggap lebih baik jika kualitas jawaban menjadi buruk.**

---

# 57. Evaluation Matrix

| Metric                             | Target MVP |
| ---------------------------------- | ---------- |
| Chat works                         | Required   |
| Manager routing                    | Required   |
| Specialist retrieval               | Required   |
| Agent visible                      | Required   |
| Token visible                      | Required   |
| Token saved                        | Required   |
| Conversation saved                 | Required   |
| Document question works            | Required   |
| Out-of-document handling           | Required   |
| Deployment                         | Required   |
| Token optimization measurement     | Required   |
| Automated comprehensive evaluation | Optional   |

---

# 58. Acceptance Criteria

## AC-01 — Chat Interface

Given user opens the application,

when the page loads,

then user can see a single chat interface.

---

## AC-02 — Manager Routing

Given user sends a simple/general question,

when the system processes it,

then Manager answers directly without Specialist.

---

## AC-03 — Specialist Routing

Given user sends a question requiring document information,

when Manager detects document dependency,

then the system calls Specialist.

---

## AC-04 — Document Answering

Given a document contains the answer,

when Specialist retrieves relevant context,

then the response is based on that context.

---

## AC-05 — Missing Information

Given the document does not contain the requested information,

then Specialist must not invent the information.

---

## AC-06 — Agent Visibility

Every assistant response must show:

```text
Manager
```

or:

```text
Specialist
```

---

## AC-07 — Token Visibility

Every assistant response must show total token usage.

---

## AC-08 — Token Persistence

Token usage must be stored in Supabase.

---

## AC-09 — Conversation Persistence

User and assistant messages must be stored in Supabase.

---

## AC-10 — Security

No API key may be exposed in frontend source code or GitHub repository.

---

## AC-11 — Deployment

Application must be accessible through a Vercel URL.

---

# 59. Example Scenarios

## Scenario 1 — General Knowledge

### Input

```text
Apa itu API?
```

### Expected Flow

```text
User
 ↓
Manager
 ↓
DIRECT
 ↓
Manager answer
```

### Expected UI

```text
Manager · XX tokens
```

---

# 60. Scenario 2 — Document Question

### Input

```text
Berapa hari cuti tahunan?
```

### Expected Flow

```text
User
 ↓
Manager
 ↓
SPECIALIST
 ↓
Retrieval
 ↓
Relevant chunk
 ↓
Specialist
 ↓
Answer
```

### Expected UI

```text
Specialist · XX tokens
```

---

# 61. Scenario 3 — Information Not Found

### Input

```text
Siapa CEO perusahaan?
```

### Expected Flow

```text
User
 ↓
Manager
 ↓
SPECIALIST
 ↓
Retrieval
 ↓
No relevant information
 ↓
Specialist says information unavailable
```

---

# 62. Scenario 4 — Multiple Questions

### Input

```text
Apa itu Next.js dan berapa hari cuti tahunan?
```

Manager harus menentukan apakah pertanyaan membutuhkan document information.

Jika bagian pertanyaan kedua membutuhkan dokumen, sistem dapat memilih:

```text
SPECIALIST
```

Specialist kemudian diberi context yang relevan.

Untuk MVP, tidak perlu membuat multi-route dalam satu message.

---

# 63. Important Design Decision

## Why Manager Exists

Manager digunakan untuk mengurangi penggunaan Specialist.

Tanpa Manager:

```text
100 questions
→ 100 Specialist requests
```

Dengan Manager:

```text
100 questions
→ Manager
→ only document-related questions
→ Specialist
```

Hal tersebut membantu mengurangi unnecessary AI calls dan token usage.

---

# 64. Important Design Decision

## Why Specialist Uses Retrieval

Mengirim seluruh dokumen pada setiap request:

```text
Question
+
Entire document
```

dapat menyebabkan input token besar.

Sistem memilih:

```text
Question
+
Relevant chunks only
```

sehingga context lebih kecil dan efisien.

---

# 65. Important Design Decision

## Why One Chat Interface

Requirement mengharuskan user hanya melihat satu kolom chat.

Oleh karena itu architecture internal boleh memiliki:

```text
Manager
Specialist
Retrieval
```

tetapi UX tetap:

```text
One assistant
One conversation
One input
```

---

# 66. Observability

MVP minimal menyimpan:

```text
conversation_id
user message
agent
assistant response
input tokens
output tokens
total tokens
timestamp
```

Data tersebut memungkinkan evaluasi setelah testing.

---

# 67. Recommended Logging

Backend dapat melakukan logging internal untuk debugging:

```text
request received
manager route
retrieval result count
specialist called
token usage
response generated
```

Namun informasi sensitif tidak boleh dicatat.

---

# 68. Environment Configuration

Development:

```text
.env.local
```

Production:

```text
Vercel Environment Variables
```

GitHub:

```text
.env.example
```

---

# 69. Deployment Flow

```text
Developer
   │
   ▼
GitHub
   │
   ▼
Vercel
   │
   ├── Next.js application
   │
   └── Environment Variables
          │
          ├── Gemini API
          └── Supabase
```

---

# 70. Deployment Checklist

Before submission:

```text
[ ] GitHub repository accessible
[ ] README complete
[ ] .env excluded
[ ] .env.example exists
[ ] Supabase schema applied
[ ] Document available
[ ] AI API configured
[ ] Vercel deployment works
[ ] Chat works
[ ] Manager routing works
[ ] Specialist routing works
[ ] Token displayed
[ ] Token saved
[ ] History saved
[ ] Out-of-document test works
[ ] Mobile/basic responsive UI works
```

---

# 71. GitHub Repository Contents

Recommended:

```text
README.md
NOTES.md
.env.example
.gitignore

/app
/components
/lib

/documents
/supabase
/tests

package.json
package-lock.json
```

Repository must not contain secret keys.

---

# 72. README Requirements

README harus menjelaskan:

1. project overview;
2. architecture;
3. technology stack;
4. setup;
5. environment variables;
6. database setup;
7. run locally;
8. deployment;
9. testing;
10. token optimization strategy.

---

# 73. One-Page Technical Note

Catatan untuk HR harus menjawab:

## 1. Bagaimana Manager memutuskan routing?

Jelaskan:

```text
Manager melakukan classification:
DIRECT / SPECIALIST
```

dan kriteria masing-masing.

## 2. Apa yang dilakukan untuk mengurangi token?

Jelaskan:

* Manager routing;
* Specialist hanya ketika diperlukan;
* retrieval top-K;
* prompt ringkas;
* context/history terbatas.

Sertakan angka before vs after hasil pengujian.

## 3. Bagaimana memastikan jawaban tetap benar?

Jelaskan:

* test cases;
* document-grounded response;
* out-of-document test;
* routing accuracy;
* answer correctness.

## 4. Apa yang paling membuat mentok?

Jelaskan masalah nyata dan solusi yang benar-benar dilakukan.

## 5. Bagian mana yang dikerjakan sendiri dan dibantu AI?

Jelaskan dengan jujur:

* ide/decision;
* code yang ditulis sendiri;
* code yang dibantu AI;
* debugging/review yang dilakukan menggunakan AI.

---

# 74. AI Usage Policy

AI boleh digunakan selama development.

AI dapat membantu:

* boilerplate;
* debugging;
* refactoring;
* documentation;
* code review;
* prompt drafting.

Namun keputusan architecture dan trade-off harus dapat dijelaskan oleh developer.

---

# 75. Success Criteria

Project dianggap berhasil ketika:

```text
User
 ↓
Single Chat UI
 ↓
Manager
 ↓
 ├── General Question → Manager
 │
 └── Document Question → Specialist
                            ↓
                       Retrieval
                            ↓
                       Document Answer
```

dan setiap assistant response menyediakan:

```text
Agent
+
Answer
+
Token Usage
```

serta data tersebut tersimpan di database.

---

# 76. Final Product Flow

```text
                              USER
                                │
                                │ question
                                ▼
                     ┌────────────────────┐
                     │     NEXT.JS UI     │
                     └─────────┬──────────┘
                               │
                               │ POST /api/chat
                               ▼
                     ┌────────────────────┐
                     │      MANAGER       │
                     │                    │
                     │  classify intent   │
                     └─────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                 DIRECT               SPECIALIST
                    │                     │
                    │                     ▼
                    │             ┌──────────────┐
                    │             │  RETRIEVAL   │
                    │             └──────┬───────┘
                    │                    │
                    │                    ▼
                    │             Relevant Chunks
                    │                    │
                    │                    ▼
                    │             ┌──────────────┐
                    │             │  SPECIALIST  │
                    │             └──────┬───────┘
                    │                    │
                    └──────────┬─────────┘
                               │
                               ▼
                       Final AI Response
                               │
                    ┌──────────┴──────────┐
                    │                     │
              Token Usage           Agent Name
                    │                     │
                    └──────────┬──────────┘
                               │
                               ▼
                         Save to Supabase
                               │
                               ▼
                         Return to User
```

---

# 77. MVP Priority

Prioritas implementasi:

### P0 — Must Have

```text
Chat UI
Manager
Specialist
Routing
Document retrieval
Supabase
Token tracking
Database persistence
Vercel deployment
```

### P1 — Important

```text
Error handling
Testing
README
Token benchmarking
Out-of-document handling
```

### P2 — Optional

```text
Streaming
Advanced analytics
Document upload UI
Authentication
Multi-document UI
```

---

# 78. Guiding Principle

Project harus mengikuti prinsip:

> **Use the smallest amount of AI and context necessary to produce a correct answer.**

Dengan kata lain:

```text
Jangan gunakan Specialist
jika Manager cukup.

Jangan kirim seluruh dokumen
jika beberapa chunk cukup.

Jangan kirim seluruh history
jika context terbatas cukup.

Jangan gunakan model lebih mahal
jika model ringan sudah cukup.
```

---

# 79. Definition of Done

Project dianggap selesai untuk submission ketika:

```text
✅ User dapat membuka aplikasi
✅ User dapat mengirim pertanyaan
✅ Manager menerima semua pertanyaan
✅ Manager dapat memilih DIRECT
✅ Manager dapat memilih SPECIALIST
✅ Specialist dapat membaca knowledge base
✅ Specialist dapat menjawab berdasarkan dokumen
✅ Specialist tidak mengarang ketika informasi tidak tersedia
✅ Agent ditampilkan
✅ Token ditampilkan
✅ Token tersimpan
✅ Conversation tersimpan
✅ Aplikasi berjalan di Vercel
✅ Repository GitHub tersedia
✅ README tersedia
✅ Technical note tersedia
✅ Test cases tersedia
```

---

# 80. Submission Package

Yang dikirim kepada HR:

```text
1. GitHub Repository
2. Vercel Deployment URL
3. One-Page Technical Note
```

Seluruh source code, document, database schema, test cases, dan dokumentasi berada di dalam repository GitHub.

---

# 81. Final Summary

Sistem ini bukan dua chatbot terpisah.

Sistem ini adalah:

```text
                ONE CHATBOT INTERFACE
                         │
                         ▼
                      MANAGER
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
           DIRECT               SPECIALIST
             │                       │
             │                 DOCUMENT RETRIEVAL
             │                       │
             └───────────┬───────────┘
                         ▼
                     USER ANSWER
                         │
                         ▼
                TOKEN + AGENT LOG
                         │
                         ▼
                     SUPABASE
```

Tujuan utama arsitektur ini adalah:

**correct routing + document-grounded answering + low token usage + transparent observability.**
