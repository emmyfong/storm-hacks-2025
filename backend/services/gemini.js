//Handles all Gemini API functions

import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//Generate Trivia Question based on user prompts
//Return format: [question, optionA, optionB, optionC, optionD, correctOptionString]
export async function generateTriviaQuestion(userPrompt) {
    try {
        //prompt engineering
        const engineerPrompt = `
            You are a machine that only outputs JSON. Do not include any conversational text, greetings, or explanations.

            Based on the following topic, create a medium level, unique and engaging trivia question with four plausible answer options. One option must be correct. The question's difficulty should be hard enough that only 25% of people can solve it. 

            Your entire response must be a single, valid JSON array of strings with exactly 6 elements.
            The array must follow this format: ["question", "optionA", "optionB", "optionC", "optionD", "correctAnswerString"]

            The last element in the array MUST be the string that exactly matches the correct answer option. Do NOT add any extra explanation or formatting

            Example Input Topic: "Solar System"
            Example Output: ["Which planet is known as the Red Planet?", "Venus", "Mars", "Jupiter", "Saturn", "Mars"]

            Now, generate a trivia question for this topic: "${userPrompt}
        `;

        const result = await gemini.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: [{ role: "user", parts: [{ text: engineerPrompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        })
        
        const candidates = result.candidates;
        if (!candidates || candidates.length === 0 || !candidates[0].content || !candidates[0].content.parts || candidates[0].content.parts.length === 0) {
            console.error("[Gemini] Invalid response structure or request was blocked.");
            console.error("Full API Result:", JSON.stringify(result, null, 2));
            throw new Error("Invalid response structure from Gemini.");
        }

        const text = candidates[0].content.parts[0].text;
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        let triviaArray
        try {
            triviaArray = JSON.parse(cleanedText);
        } catch (e) {
            console.error("[Gemini] Failed to parse JSON. Raw text:", text);
            throw new Error("Gemini did not return valid JSON.");
        }
        
        if (Array.isArray(triviaArray) && triviaArray.length === 6) {
            console.log("[Gemini] Successfully generated trivia array:", triviaArray);
            return triviaArray;
            } else {
                throw new Error("Generated data is not in the correct format.");
        }
    } catch (error) {
        console.error("Error generating content from Gemini: ", error);
        return null;
    }
}