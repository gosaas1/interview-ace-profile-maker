import React, { useState } from "react";

export default function CVUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [structured, setStructured] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("cv", file);

    try {
      setLoading(true);
      setStructured(null);
      setError(null);
      setSaveStatus(null);

      const res = await fetch("http://localhost:8000/api/cv/parse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setStructured(data.structured);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!structured) return;
    setSaveStatus(null);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/cv/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(structured),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSaveStatus("CV saved successfully!");
    } catch (err: any) {
      setError(err.message);
      setSaveStatus(null);
    }
  };

  return (
    <div className="p-4 border rounded max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Your CV</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 w-full"
        />
        <button
          type="submit"
          disabled={!file || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Parsing..." : "Upload & Parse"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">Error: {error}</p>}
      {saveStatus && <p className="text-green-600 mt-4">{saveStatus}</p>}

      {structured && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Parsed CV:</h3>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(structured, null, 2)}
          </pre>
          <button
            onClick={handleSave}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save to Supabase
          </button>
        </div>
      )}
    </div>
  );
} 