import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const SPECIALIST_MODEL = 'gemini-3.5-flash-lite';

export async function callSpecialist(question: string, context: string) {
  const model = genAI.getGenerativeModel({
    model: SPECIALIST_MODEL,
    systemInstruction: "You are the Specialist AI. Answer the user's question using ONLY the provided retrieved context. If the answer is not in the context, say 'The requested information was not found in the available documents.' Do not invent internal information. Keep answers concise."
  });

  const prompt = `Context:\n${context}\n\nQuestion:\n${question}`;
  const result = await model.generateContent(prompt);
  
  return {
    answer: result.response.text(),
    usage: {
      inputTokens: result.response.usageMetadata?.promptTokenCount || 0,
      outputTokens: result.response.usageMetadata?.candidatesTokenCount || 0,
      totalTokens: result.response.usageMetadata?.totalTokenCount || 0
    }
  };
}
