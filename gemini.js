import { GoogleGenerativeAI } from "@google/generative-ai";

// This is your Vercel serverless function.
// It runs on the server, so it's safe to use the API key here.

// IMPORTANT: The API key is now an environment variable.
// You must set this in your Vercel project settings.
// Variable name: GEMINI_API_KEY
// Variable value: AIzaSyAZP0N1M7raZvqt56LVJpFlElPOf6N1hiU
const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message: userMessage } = request.body;

    if (!userMessage) {
        return response.status(400).json({ error: 'User message is required.' });
    }

    const prompt = `
        You are 'Hayyak Mood Advisor', a friendly and empathetic AI assistant for tourists in Dubai. 
        Your goal is to understand the user's feeling and suggest 3 places or activities in Dubai that would suit their mood.
        The user's message is: "${userMessage}"

        Based on their feeling, provide a response in the following JSON format ONLY. 
        Do not add any other text, comments, or markdown formatting like \`\`\`json before or after the JSON object.

        {
          "response": "A short, empathetic response to the user's feeling, followed by an introduction to your suggestions.",
          "places": [
            { "name": "Name of the first suggested place/activity", "info": "A brief, one-sentence description of why it's a good suggestion for their mood." },
            { "name": "Name of the second suggested place/activity", "info": "A brief, one-sentence description." },
            { "name": "Name of the third suggested place/activity", "info": "A brief, one-sentence description." }
          ]
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const aiResponse = await result.response;
        const jsonString = aiResponse.text();
        
        // Parse the JSON to ensure it's valid before sending it to the client
        const jsonData = JSON.parse(jsonString);

        return response.status(200).json(jsonData);

    } catch (error) {
        console.error("Error in Gemini API serverless function:", error);
        return response.status(500).json({ error: "Failed to get a response from the AI model." });
    }
}