import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiResponse = async (apiKey: string, prompt: string) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using 1.5 flash as 2.5 is not a standard release yet, typically people refer to latest
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
