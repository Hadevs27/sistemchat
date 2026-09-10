import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const MANAGER_MODEL = 'gemini-3.5-flash-lite';

export async function callManager(history: { role: string, content: string }[], message: string) {
  const model = genAI.getGenerativeModel({
    model: MANAGER_MODEL,
    systemInstruction: "You are the Manager AI. Determine if the user's question requires internal company documents to answer. If it is a general knowledge question, greetings, or math, choose DIRECT and provide the answer. If it requires information about House of Leaders, HOL Group, Brilliant Liu, Brand N Purpose, HOL Inner Circle, Media, or Events, choose SPECIALIST and leave answer blank.",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          // @ts-ignore
          route: { type: SchemaType.STRING, enum: ["DIRECT", "SPECIALIST"] },
          answer: { type: SchemaType.STRING, description: "Answer the question here only if route is DIRECT." }
        },
        required: ["route"]
      }
    }
  });

  const formattedHistory = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.content }]
  }));
  
  const chat = model.startChat({ history: formattedHistory });
  const result = await chat.sendMessage(message);
  
  const responseText = result.response.text();
  const parsed = JSON.parse(responseText);
  
  return {
    route: parsed.route,
    answer: parsed.answer || '',
    usage: {
      inputTokens: result.response.usageMetadata?.promptTokenCount || 0,
      outputTokens: result.response.usageMetadata?.candidatesTokenCount || 0,
      totalTokens: result.response.usageMetadata?.totalTokenCount || 0
    }
  };
}
