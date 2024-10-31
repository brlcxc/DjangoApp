import { useState } from "react";
import api from '../api';

function LLMInterface() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateResponse = async () => {
    setLoading(true);
    try {
      // Make the API request to your Django backend
      const response = await api.fetch('/api/llm/ask/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Add auth token if needed
        },
        body: JSON.stringify({ question: inputText }),
      });

      // Parse the response
      if (response.ok) {
        const data = await response.json();
        setOutputText(data.answer); // Assuming the backend returns { "answer": "response text" }
      } else {
        setOutputText("Failed to get a response from the server.");
      }
    } catch (error) {
      setOutputText("An error occurred while fetching the response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <div className="w-full p-4 border rounded-lg shadow-lg bg-gray-100">
        <p className="text-gray-800">
          {loading ? "Loading..." : outputText || "Response will appear here..."}
        </p>
      </div>
      <textarea
        className="w-full p-4 border rounded-lg shadow-lg focus:outline-none focus:ring focus:ring-indigo-500"
        rows="4"
        placeholder="Type your question here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button
        className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        onClick={handleGenerateResponse}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Response"}
      </button>
    </div>
  );
}

export default LLMInterface;
