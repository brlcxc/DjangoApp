import { useState } from "react";
import { useSelectedGroup } from '../context/SelectedGroupContext';
import api from '../api';
import TransactionList from "../components/TransactionList";

function LLMInterface() {
  const { selectedGroupUUIDs } = useSelectedGroup();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mergeData, setMergeData] = useState(null);  // State for transaction data

  const handleInitialGenerateResponse = async () => {
    setLoading(true);
    try {
      // Step 1: Fetch initial response from the generic endpoint using axios
      const response = await api.post(`/api/llm/ask/`, { question: inputText });

      setOutputText(response.data.answer);  // Display the initial response for editing
      setIsEditing(true);  // Allow editing before sending to group-specific endpoint
    } catch (error) {
      setOutputText("An error occurred while fetching the response: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalGenerateResponse = async () => {
    setLoading(true);
    try {
      // Step 2: Send the edited response to the group-specific endpoint using axios
      const endpoint = `/api/llm/ask/${selectedGroupUUIDs}/`;
      const response = await api.post(endpoint, { question: outputText });

      setMergeData(response.data);  // Set mergeData with transactions
      
      console.log(response.data);
    } catch (error) {
      setOutputText("An error occurred while fetching the response: " + error);
    } finally {
      setLoading(false);
      setIsEditing(false);  // Return to normal mode after sending to the group endpoint
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
        disabled={isEditing}  // Disable inputText editing while editing response
      />
      {isEditing ? (
        <>
          <textarea
            className="w-full p-4 border rounded-lg shadow-lg focus:outline-none focus:ring focus:ring-indigo-500"
            rows="4"
            value={outputText}
            onChange={(e) => setOutputText(e.target.value)}  // Allow editing the output text
          />
          <button
            className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={handleFinalGenerateResponse}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Edited Response"}
          </button>
        </>
      ) : (
        <button
          className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={handleInitialGenerateResponse}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Response"}
        </button>
      )}
      {/* Conditionally render TransactionList with mergeData */}
      {mergeData && <TransactionList mergeData={mergeData} />}
    </div>
  );
}

export default LLMInterface;
