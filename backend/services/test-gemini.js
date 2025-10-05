// TEMP FILE -> used for testing the gemini prompting

import { generateTriviaQuestion } from './gemini.js';

async function runTest() {
  console.log("--- Running Gemini Test ---");
  const testPrompt = "Famous volcanoes";
  console.log(`Testing with prompt: "${testPrompt}"`);

  const triviaResult = await generateTriviaQuestion(testPrompt);

  if (triviaResult) {
    console.log("\n✅ SUCCESS! Received valid data:");
    console.log(triviaResult);
  } else {
    console.log("\n❌ FAILED. Check the error message above.");
  }
  console.log("\n--- Test Complete ---");
}

runTest();