import express from "express";
const genAIRouter = express.Router();
import { weatherAPI } from "../controller/API.js";
import genAi from "../genAi.js";

const conversationHistory = [];

genAIRouter.post("/allInfo", async (req, res) => {
  let answer;
  const question = req.body.msg;

  let prompt = `
You are a smart AI agent capable of answering any user question.
You can handle both:
1️⃣ Weather-related queries  
2️⃣ General knowledge, chat, jokes, facts, or any casual conversation.

### INSTRUCTIONS
- If the user is asking about weather, respond strictly in JSON format like this:
{
  "weather_details_needed": true,
  "location": [{"city": "Delhi", "date": "today"}]
}

- If the user is asking about future weather then you will use new Date().toISOString().split('T')[0] function to know the current date.

- If the user is asking about anything else (not weather-related),
  respond in JSON format like this:
{
  "weather_details_needed": false,
  "general_response": "Your detailed, natural, human-like answer here."
}

### WEATHER RESPONSE FORMAT (for later use)
If weather details are already provided, return:
{
  "weather_details_needed": false,
  "weather_report": "Bhai Delhi ka mausam mast hai — halki thand aur halka breeze chal raha hai. 20°C temperature hai, hawa me freshness hai. 😎"
}

User asked: ${question}

⚠️ Always reply in valid JSON format only.
  `;
  try {
    conversationHistory.push({ role: "user", parts: [{ text: prompt }] });

    while (true) {
      let data = await genAi(conversationHistory);
      conversationHistory.push({ role: "model", parts: [{ text: data }] });

      // Clean and parse JSON safely
      data = data.trim();
      data = data.replace(/```json|```/g, "").trim();
      let response;

      try {
        response = JSON.parse(data);
      } catch (e) {
        console.log("⚠️ Invalid JSON from model. Retrying...");
        continue;
      }

      // ----- Handle General Chat -----
      if (
        response.weather_details_needed === false &&
        response.general_response
      ) {
        answer = response.general_response;

        break;
      }

      // ----- Handle Weather -----
      if (
        response.weather_details_needed === false &&
        response.weather_report
      ) {
        answer = response.weather_report;
        break;
      }

      // ----- Fetch Weather Info -----
      if (response.weather_details_needed === true && response.location) {
        const weatherInformation = await weatherAPI(response.location);
        const weather = JSON.stringify(weatherInformation);
        conversationHistory.push({ role: "user", parts: [{ text: weather }] });
      }
    }

    return res.status(200).json({
      answer: answer,
      success: true,
    });
  } catch (error) {}
});

export default genAIRouter;
