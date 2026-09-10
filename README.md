# Company AI Assistant

MVP for a Next.js chat interface using a Manager/Specialist agent architecture, backed by Supabase and the Gemini API.

## Architecture
- **Manager Agent:** Analyzes the prompt and recent history to route to DIRECT or SPECIALIST. If DIRECT, it also generates the answer immediately.
- **Specialist Agent:** If routed here, we embed the query, fetch the top-K relevant chunks from our local document, and prompt the Specialist to answer only using the retrieved context.

## Setup
1. 
pm install
2. Create a Supabase project and run supabase/schema.sql in the SQL Editor.
3. Copy .env.example to .env.local and add your keys.
4. 
pm run dev

## Environment Variables
- GEMINI_API_KEY: Google Gemini API key.
- NEXT_PUBLIC_SUPABASE_URL: Your Supabase URL.
- NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase Anon Key.
- SUPABASE_SERVICE_ROLE_KEY: Your Supabase Service Role Key (for backend only).

## Token Optimization Strategy
- **Bounded History:** Only the last 5 user messages are passed to the context.
- **Top-K Context:** The Specialist only receives the most relevant sections, not the whole file.
- **Combined Routing/Answering:** The Manager model performs routing and direct answering in a single API call when no document context is needed.
