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
  const [mergeData, setMergeData] = useState([]); // Initialize as an empty array
  const [evaluation, setEvaluationData] = useState(null);
  const [situations, setSituations] = useState([]);
  const [situationsSubject, setSubject] = useState("");
  const [newSituationText, setNewSituationText] = useState("");

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
      setMergeData(transactions); // Update mergeData with new transactions
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

  const handleAddSituation = () => {
    if (newSituationText.trim()) {
      setSituations([
        ...situations,
        { text: newSituationText, isEditing: false },
      ]);
      setNewSituationText(""); // Clear the input after adding
    }
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col bg-white p-8 mb-8 rounded-xl shadow-lg">
          <TransactionList mergeData={mergeData} />
        </div>
        <div className="flex flex-col bg-white p-8 mb-8 rounded-xl shadow-lg">
          <TransactionList mergeData={mergeData} />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="p-4 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition">
          Subject: {situationsSubject}
        </div>
        {situations.map((situation, index) => (
          <div
            key={index}
            className="p-4 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition flex items-center space-x-2 h-14"
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
                className="bg-white text-black rounded w-full h-full overflow-hidden"
                autoFocus
              />
            ) : (
              <span onClick={() => handleEditClick(index)}>
                {situation.text}
              </span>
            )}
          </div>
        ))}
         <div class="justify-end items-center">
  <p class="text-white text-6xl">
    ...
  </p>
</div>

        <div className="p-4 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
          <input
            type="text"
            placeholder="Add new situation..."
            value={newSituationText}
            onChange={(e) => setNewSituationText(e.target.value)}
            className="p-2 rounded border border-gray-300"
          />
          <button
            className="p-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
            onClick={handleAddSituation}
          >
            +
          </button>
        </div>
      </div>
      <textarea
        className="w-full p-4 border rounded-lg shadow-lg focus:outline-none focus:ring focus:ring-indigo-500"
        rows="2"
        placeholder="Type a financial situation you would like to predict for here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      {isEditing ? (
        <>
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
    </div>
  );
}

export default LLMInterface;
