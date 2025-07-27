"use client";

import { useState, useEffect } from "react";

interface PdfViewerProps {
  pdfFile: File | null;
}

const PdfViewer = ({ pdfFile }: PdfViewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfFile) {
      const url = URL.createObjectURL(pdfFile);
      setPdfUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPdfUrl(null);
    }
  }, [pdfFile]);

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-200 rounded">
        <p className="text-gray-500">No PDF selected</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <iframe
        src={pdfUrl}
        className="w-full h-96 border rounded"
        title="PDF Viewer"
      />
    </div>
  );
};

export default PdfViewer;
