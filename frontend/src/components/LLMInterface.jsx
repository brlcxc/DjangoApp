import { useState } from "react";
import { useSelectedGroup } from "../context/SelectedGroupContext";
import api from "../api";
import TransactionList from "../components/TransactionList";

function LLMInterface() {
  const { selectedGroupUUIDs } = useSelectedGroup();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mergeData, setMergeData] = useState(null);
  const [evaluation, setEvaluationData] = useState(null);
  const [situations, setSituations] = useState([]);
  const [situationsSubject, setSubject] = useState("");

  const handleInitialGenerateResponse = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/api/llm/ask/`, { question: inputText });
      const situationsList = response.data.situations.map((situation) => ({
        text: situation,
        isEditing: false,
      }));
      const subject = response.data.subject;
      setSituations(situationsList);
      setSubject(subject);
      setOutputText(situationsList.map((s) => s.text).join(", "));
      setIsEditing(true);
    } catch (error) {
      setOutputText("An error occurred while fetching the response: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalGenerateResponse = async () => {
    setLoading(true);
    try {
      const endpoint = `/api/llm/ask/${selectedGroupUUIDs}/`;
      const response = await api.post(endpoint, { question: outputText });
      const transactions = response.data.new_transactions;
      const evaluation = response.data.evaluation.answer;
      setMergeData(transactions);
      setEvaluationData(evaluation);
    } catch (error) {
      setOutputText("An error occurred while fetching the response: " + error);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const handleRemoveSituation = (index) => {
    setSituations(situations.filter((_, i) => i !== index));
  };

  const handleEditClick = (index) => {
    setSituations(
      situations.map((situation, i) =>
        i === index ? { ...situation, isEditing: true } : situation
      )
    );
  };

  const handleSaveEdit = (index, newText) => {
    setSituations(
      situations.map((situation, i) =>
        i === index ? { text: newText, isEditing: false } : situation
      )
    );
  };

  const handleEditChange = (index, newText) => {
    setSituations(
      situations.map((situation, i) =>
        i === index ? { ...situation, text: newText } : situation
      )
    );
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
        disabled={isEditing}
      />
      <div className="p-4 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition">
        Subject: {situationsSubject}
      </div>
      <div className="flex space-x-4">
        {situations.map((situation, index) => (
          <div
            key={index}
            className="p-4 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition flex items-center space-x-2"
          >
            <button
              onClick={() => handleRemoveSituation(index)}
              className="text-white bg-red-500 rounded-full p-1 hover:bg-red-600 focus:outline-none"
            >
              &times;
            </button>
            {situation.isEditing ? (
              <input
                type="text"
                value={situation.text}
                onChange={(e) => handleEditChange(index, e.target.value)}
                onBlur={() => handleSaveEdit(index, situation.text)}
                className="bg-white text-black p-2 rounded"
                autoFocus
              />
            ) : (
              <span onClick={() => handleEditClick(index)}>{situation.text}</span>
            )}
          </div>
        ))}
      </div>
      {isEditing ? (
        <>
          <textarea
            className="w-full p-4 border rounded-lg shadow-lg focus:outline-none focus:ring focus:ring-indigo-500"
            rows="4"
            value={outputText}
            onChange={(e) => setOutputText(e.target.value)}
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
      {mergeData && <TransactionList mergeData={mergeData} />}
      <div>{evaluation}</div>
    </div>
  );
}

export default LLMInterface;