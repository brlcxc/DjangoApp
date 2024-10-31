import { useState } from "react";

function LLMInterface() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const handleGenerateResponse = () => {
    // Example: Replace this with actual API call to your LLM backend
    const response = "This is a response from the LLM based on the input.";
    setOutputText(response);
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <div className="w-full p-4 border rounded-lg shadow-lg bg-gray-100">
        <p className="text-gray-800">
          {outputText || "Response will appear here..."}
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
      >
        Generate Response
      </button>
    </div>
  );
}

export default LLMInterface;
