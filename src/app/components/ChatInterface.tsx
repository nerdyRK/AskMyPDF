"use client";

import { useState, useRef, useEffect } from "react";

interface ChatInterfaceProps {
  pdfText: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatInterface = ({ pdfText }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !pdfText || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Add user message to chat
      const userMessage: Message = { role: "user", content: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      // Send to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfText,
          message: input,
          chatHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      const aiMessage: Message = { role: "assistant", content: data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Chat with PDF</h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      {!pdfText ? (
        <div className="flex-1 flex items-center justify-center bg-gray-100 rounded">
          <p className="text-gray-500">
            Upload and process a PDF to start chatting
          </p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 p-4 rounded">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  Ask questions about the PDF content
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-3 p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-100 text-blue-900 ml-auto max-w-xs md:max-w-md"
                      : "bg-gray-200 text-gray-900 mr-auto max-w-xs md:max-w-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the PDF..."
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !pdfText}
                className={`px-4 py-2 rounded ${
                  isLoading || !pdfText
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
