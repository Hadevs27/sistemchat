# Development Notes

## Routing Logic
The Manager AI uses a structured output schema (oute: "DIRECT" | "SPECIALIST", along with nswer) to decide the routing. By using a small Gemini 1.5 Flash model and passing only the last 5 messages, we save tokens. 

## Token Optimization Techniques
1. **Bounded History:** Only the last 5 user/assistant messages are sent.
2. **One-Call Direct Route:** When the Manager decides it's a general question, it generates the answer in the same structured output call, eliminating a second AI call.
3. **Selective Retrieval:** The Specialist is only called for document-dependent queries, and it only receives the top 3 most relevant sections, not the entire handbook.

## Correctness Testing
Tested via strict TypeScript compiler (
px tsc --noEmit). Runtime testing and end-to-end correctness verification was constrained by the absence of provided API keys for Gemini and Supabase in the build environment. The application is written to securely handle errors in these dependencies and properly propagate usage metadata.

## Biggest Obstacle and Solution
Ensuring a single call for the Manager while still returning structured JSON. This was solved by using Gemini's structured output where the nswer field is requested alongside the oute. For SPECIALIST routes, the answer field is ignored.

## AI-Assisted Areas
Standard project scaffolding and Next.js boilerplate setup.

## Benchmark Results
(Awaiting execution. A 	ests/benchmark.mjs script was provided to calculate these metrics once keys are injected. I have intentionally left actual measured values blank here as requested by 'Never invent results'.)
