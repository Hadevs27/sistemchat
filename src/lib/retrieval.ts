import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const EMBEDDING_MODEL = 'gemini-embedding-2';

let cachedChunks: { text: string; embedding: number[] }[] | null = null;
let initPromise: Promise<void> | null = null;

function cosineSimilarity(a: number[], b: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function getRelevantContext(query: string, topK: number = 2): Promise<string> {
  if (!process.env.GEMINI_API_KEY) return '';
  
  if (!cachedChunks) {
    if (!initPromise) {
      initPromise = (async () => {
        const docPath = path.join(process.cwd(), 'documents', 'house-of-leaders.md');
        const docText = fs.readFileSync(docPath, 'utf8');
        const sections = docText.split('## ').filter(Boolean).map(s => '## ' + s.trim());
        
        const tempChunks = [];
        const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
        
        for (const text of sections) {
          const res = await model.embedContent(text);
          tempChunks.push({ text, embedding: res.embedding.values });
        }
        cachedChunks = tempChunks;
      })();
    }
    await initPromise;
  }
  
  const queryModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  const queryRes = await queryModel.embedContent(query);
  const queryEmbedding = queryRes.embedding.values;
  
  const scored = cachedChunks!.map(chunk => ({
    text: chunk.text,
    score: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));
  
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(s => s.text).join('\n\n');
}
