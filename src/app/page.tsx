"use client";

import { useState, useRef } from "react";
import PdfViewer from "./components/PdfViewer";
import ChatInterface from "./components/ChatInterface";
import { validateFile } from "@/util/validateFile";
import { toast, ToastContainer } from "react-toastify";

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("hah");
    if (e.target.files && e.target.files[0]) {
      const validationError = validateFile(e.target.files[0], 5, ["pdf"]);
      // console.log("hah", validationError);

      if (validationError) {
        toast.error(validationError);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      setPdfFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!pdfFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);

      const response = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract text from PDF");
      }

      const data = await response.json();
      setPdfText(data.text);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          PDF Chat Interface
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - PDF Upload and Viewer */}
          <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
              <button
                onClick={triggerFileInput}
                className="w-full bg-blue-500 cursor-pointer hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
              >
                {pdfFile ? "Change PDF" : "Select PDF"}
              </button>
              {pdfFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {pdfFile.name}
                </p>
              )}
            </div>

            {pdfFile && (
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className={`w-full py-2 px-4 cursor-pointer rounded transition duration-200 mb-4 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isLoading
                  ? "Processing..."
                  : "Extract Text and Prepare for Chat"}
              </button>
            )}

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                {error}
              </div>
            )}

            <PdfViewer pdfFile={pdfFile} />
          </div>

          {/* Right side - Chat Interface */}
          <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <ChatInterface pdfText={pdfText} />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
