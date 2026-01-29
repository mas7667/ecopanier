import { GoogleGenerativeAI } from "@google/generative-ai";
import { InventoryItem } from "../types";

// Note: In a real app, never expose API keys on the client side.
// This is structured as per the prompt instructions using process.env.API_KEY.
// The component using this will handle the "missing key" scenario gracefully.

let client: GoogleGenerativeAI | null = null;

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.API_KEY;

if (apiKey) {
  client = new GoogleGenerativeAI({ apiKey });
}

export const generateRecipeSuggestion = async (inventory: InventoryItem[]) => {
  if (!client) {
    throw new Error("API Key not configured");
  }

  const ingredientsList = inventory.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(", ");

  const prompt = `
    Based on the following available ingredients: ${ingredientsList}.
    Suggest a creative recipe that uses as many of these ingredients as possible, prioritizing those expiring soon.
    Return the response in JSON format in French with this structure:
    {
      "name": "recipe name",
      "description": "short description",
      "prepTime": number,
      "difficulty": "Facile" | "Moyen" | "Difficile",
      "steps": ["step1", "step2"],
      "ingredientsUsed": ["ingredient1", "ingredient2"]
    }
  `;

  try {
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    
    if (!text) throw new Error("No response from AI");
    
    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse AI response as JSON");
    
    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
};
