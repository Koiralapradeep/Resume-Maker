import React, { useState, useEffect } from "react";
import { useResumeStore } from "./store/useResumeStore";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import axios from "axios";

export default function App() {
  const { data, isPreviewVisible, togglePreview } = useResumeStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Auto-hide success/error message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const downloadPDF = async () => {
    try {
      setLoading(true);
      setMessage("");

      const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const res = await axios.post(`${BACKEND}/api/resume/generate`, data, {
        responseType: "arraybuffer",
        headers: { "Content-Type": "application/json" },
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.personal?.name || "resume"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setMessage("PDF downloaded successfully.");
    } catch (err) {
      console.error("PDF generation failed:", err);
      setMessage("Failed to generate PDF. Please check your connection or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-inter flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 select-none">
          Resume Builder
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => togglePreview(!isPreviewVisible)}
            className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium rounded-md shadow-md transition-all duration-200 cursor-pointer active:scale-95"
          >
            {isPreviewVisible ? "Hide Preview" : "Preview"}
          </button>

          <button
            onClick={downloadPDF}
            disabled={loading}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-md transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto flex-1 w-full">
        <div className="overflow-y-auto h-[calc(100vh-6rem)] pr-2">
          <ResumeForm />
        </div>

        {isPreviewVisible && (
          <div className="overflow-y-auto h-[calc(100vh-6rem)] px-3">
            <div
              id="resume-preview"
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 relative transition-all duration-500 hover:shadow-2xl"
            >
              <ResumePreview />
            </div>
          </div>
        )}
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">
          <div className="bg-white px-8 py-5 rounded-lg shadow-lg text-gray-700 font-medium text-lg flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p>Generating PDF, please wait...</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500 border-t border-gray-200 bg-white">
        © 2025 · Made with love by{" "}
        <span className="font-medium text-gray-700">Pradeep Koirala</span>
      </footer>

      {/* Temporary Message */}
      {message && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-2 rounded-lg shadow-lg text-sm transition-opacity duration-500">
          {message}
        </div>
      )}
    </div>
  );
}
