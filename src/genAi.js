import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();



const ai = new GoogleGenAI({apiKey:process.env.GEN_API_KEY});

async function genAi(conversationHistory) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
     contents: conversationHistory,
  });
 return response.text;
}


export default genAi;
