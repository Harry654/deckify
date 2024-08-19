import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const systemPrompt = `
You are an AI designed to generate educational flashcards. For any given topic, create 12 flashcards consisting of question and answer pairs in the following JSON format:

{
  "flashcards": [
    {
      "front": "Question related to the topic",
      "back": "Answer to the question"
    },
    {
      "front": "Question related to the topic",
      "back": "Answer to the question"
    },
    ...
    {
      "front": "Question related to the topic",
      "back": "Answer to the question"
    }
  ]
}

Ensure that the questions are clear and concise, and the answers are accurate. Provide a variety of questions that cover different aspects of the topic.
`;

export async function POST(req: NextRequest) {
  const data = await req.text();

  // Initialize the model (using Gemini Pro)
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent([
      systemPrompt,
      "Here's the text to create flashcards from:",
      data,
    ]);

    const response = result.response;
    let text = response.text();

    console.log(text);

    // Extract the JSON string from the response text
    const jsonStartIndex = text.indexOf("{");
    const jsonEndIndex = text.lastIndexOf("}") + 1;
    const jsonString = text.slice(jsonStartIndex, jsonEndIndex);

    // Parse the JSON string into a JSON object
    const jsonObject = JSON.parse(jsonString);

    // Return the flashcards as a JSON response
    return NextResponse.json(jsonObject.flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 },
    );
  }
}
