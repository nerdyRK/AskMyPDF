import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { pdfText, message, chatHistory } = await request.json();

    if (!pdfText || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Construct the prompt
    const prompt = `
      You are an AI assistant helping a user with questions about a PDF document.
      The PDF content is provided below. Please answer the user's question based on this content.
      If the answer cannot be found in the PDF, say "I couldn't find that information in the document."

      PDF Content:
      ${pdfText}

      Conversation History:
      ${
        chatHistory
          ? chatHistory
              .map((msg: any) => `${msg.role}: ${msg.content}`)
              .join("\n")
          : "No history yet"
      }

      User Question: ${message}

      Please provide a helpful and concise answer:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
