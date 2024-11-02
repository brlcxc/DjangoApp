import { useState } from "react";
import { useSelectedGroup } from '../context/SelectedGroupContext';
import { ACCESS_TOKEN } from "../constants";

// I feel I should send transaction context here only for merging the output
// not for sending to the llm
// I want to send the selected here so that I can send the uuid just like I sent to group

function LLMInterface() {
  const { selectedGroupUUIDs } = useSelectedGroup(); // Now safe to use
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [textBoxes, setTextBoxes] = useState(['Text 1', 'Text 2', 'Text 3', 'Text 4', 'Text 5']);

  console.log(selectedGroupUUIDs); // Corrected console log
  const handleClick = (text) => {
    setTextBoxes(textBoxes.filter((item) => item !== text));
  };

  const handleGenerateResponse = async () => {
    setLoading(true);
    try {
      // Make the API request to your Django backend
      const response = await fetch(`http://127.0.0.1:8000/api/llm/ask/${selectedGroupUUIDs}}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`, // Add auth token if needed
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
      setOutputText("An error occurred while fetching the response: " + error);
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
      <div className="flex space-x-2">
      {textBoxes.map((text) => (
        <div
          key={text}
          onClick={() => handleClick(text)}
          className="p-4 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition"
        >
          {text}
        </div>
      ))}
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