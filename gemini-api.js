/**
 * This file contains the logic for interacting with the Google Gemini API.
 * It now sends requests to a local proxy endpoint (/api/gemini) instead of directly to Google.
 */

// The new endpoint for our serverless function proxy.
const API_PROXY_URL = '/api/gemini';

export async function getAiMoodSuggestion(userMessage) {
    try {
        const response = await fetch(API_PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Proxy API Error:", errorData.error);
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error calling AI proxy:", error);
        throw new Error("Could not get a suggestion from the AI. Please check your network connection or try again.");
    }
}