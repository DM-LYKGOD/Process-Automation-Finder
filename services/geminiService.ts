import { GoogleGenAI, Type } from "@google/genai";
import { InputData, OutputData } from "../types";

export const getAutomationRecommendations = async (data: InputData): Promise<OutputData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an expert automation consultant. Analyze the following business processes for a company and provide two sets of recommendations.

    The business data is: ${JSON.stringify(data, null, 2)}

    1.  **General Automation Recommendations**: Identify processes that are good candidates for traditional automation. Focus on tasks that are highly repetitive, frequent, rule-based, and prone to human error. For each, provide the process_id, process_name, and a concise reason.

    2.  **Agentic AI Suitability Recommendations**: Identify processes that are suitable for a more advanced Agentic AI solution. Look for processes that require decision-making, handling unstructured data, interacting with multiple systems, or have complex, non-linear steps. For each, provide the process_id, process_name, a reason for its suitability, and a list of suggested high-level steps an AI agent could take to perform the process.

    Return the analysis in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            automation_recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  process_id: { type: Type.STRING },
                  process_name: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["process_id", "process_name", "reason"],
              },
            },
            agentic_recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  process_id: { type: Type.STRING },
                  process_name: { type: Type.STRING },
                  reason: { type: Type.STRING, description: "Why this process is a good fit for an Agentic AI." },
                  suggested_steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "High-level steps an AI agent could perform."
                  }
                },
                required: ["process_id", "process_name", "reason", "suggested_steps"],
              }
            }
          },
          required: ["automation_recommendations", "agentic_recommendations"],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Basic validation to ensure the response structure matches our expectation
    if (!parsedJson.automation_recommendations || !Array.isArray(parsedJson.automation_recommendations) || !parsedJson.agentic_recommendations || !Array.isArray(parsedJson.agentic_recommendations)) {
        throw new Error("Invalid response format from AI. Expected 'automation_recommendations' and 'agentic_recommendations' arrays.");
    }

    return parsedJson as OutputData;
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get recommendations from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};