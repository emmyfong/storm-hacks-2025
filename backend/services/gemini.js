//Handles all Gemini API functions

import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config();

const gemini = new GoogleGenAI(process.env.GEMINI_API_KEY);

//Generate Trivia Question based on user prompts
//Return format: [question, optionA, optionB, optionC, optionD, correctOptionString]
export async function generativeTriviaQuestion(userPrompt) {
    try {
        const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash"});

        //prompt engineering
        const engineerPrompt = `
            You are a whimsical magical shiba wizard host of a trivia game called Witch Dog, a multiplayer party game

            Based on the following topic, create a medium level, unique and engaging trivia question with four plausible answer options. One option must be correct. The question's difficulty should be hard enough that only 25% of people can solve it. 

            Your response MUST be a valid JSON array of strings, with exactly 6 elements, following this exact format:
            ["question", "optionA", "optionB", "optionC", "optionD", "correctAnswerString"]

            The last element in the array MUST be the string that exactly matches the correct answer option. Do NOT add any extra explanation or formatting

            Example Input Topic: "Solar System"
            Example Output: ["Which planet is known as the Red Planet?", "Venus", "Mars", "Jupiter", "Saturn", "Mars"]

            Now, generate a trivia question for this topic: "${userPrompt}
        `;

        const result = await model.generateContent(engineerPrompt);
        const response = result.response();
        const text = response.text();

        //Clean up the JSON array
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const triviaArray = JSON.parse(cleanedText)

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