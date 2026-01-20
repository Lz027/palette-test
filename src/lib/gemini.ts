import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiResponse = async (apiKey: string | undefined, prompt: string) => {
  try {
    // Priority: User-provided key (if any) > System key from process.env (passed via define in vite)
    const finalKey = apiKey || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : import.meta.env.VITE_GEMINI_API_KEY);
    
    if (!finalKey) {
      throw new Error("Gemini API key is missing");
    }

    const genAI = new GoogleGenerativeAI(finalKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
