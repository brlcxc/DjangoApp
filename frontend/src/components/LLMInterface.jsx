import { useState } from "react";
import { useSelectedGroup } from "../context/SelectedGroupContext";
import api from "../api";
import TransactionList from "../components/TransactionList";
import TransactionLineChart from "./TransactionLineChart";

function LLMInterface() {
  const { selectedGroupUUIDs } = useSelectedGroup();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mergeData, setMergeData] = useState([]);
  const [evaluation, setEvaluationData] = useState(null);
  const [situations, setSituations] = useState([]);
  const [situationsSubject, setSubject] = useState("");
  const [newSituationText, setNewSituationText] = useState("");
  const [showTransactionList, setShowTransactionList] = useState(false); // New state

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
  const resetState = () => {
    setInputText("");
    setOutputText("");
    setIsEditing(false);
    setSituations([]);
    setSubject("");
    setNewSituationText("");
    setMergeData([]);
    setEvaluationData(null);
    setShowTransactionList(false);
  };
  const handleFinalGenerateResponse = async () => {
    setLoading(true);
  
    try {
      // Combine subject and modified situations into a new question
      const question = `${situationsSubject}: ${situations.map((s) => s.text).join(", ")}`;
  
      const endpoint = `/api/llm/ask/${selectedGroupUUIDs}/`;
      const response = await api.post(endpoint, { question });
      
      const transactions = response.data.new_transactions;
      const evaluation = response.data.evaluation.answer;
  
      setMergeData(transactions);
      setEvaluationData(evaluation);
      setShowTransactionList(true); // Show TransactionList after sending response
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
      setNewSituationText("");
    }
  };
// const geminiTitle = "Transactions provided by gemini-1.5-flash-002";
  return (
    <div className="flex flex-col w-full items-center gap-6">
      {showTransactionList && (
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col bg-white p-8 rounded-xl shadow-lg">
            <TransactionList mergeData={mergeData} title={"Transactions provided by gemini-1.5-flash-002"}/>
          </div>
          <div className="flex flex-col bg-white p-8 rounded-xl shadow-lg">
            <TransactionLineChart mergeData={mergeData} />
          </div>
        </div>
      )}
      {showTransactionList && ( // Conditionally render TransactionList
        <div className="bg-white p-8 rounded-xl text-lg shadow-lg w-[60%]">
          {evaluation}
        </div>
      )}
      {!showTransactionList && situationsSubject && (
        <div className="flex flex-col space-y-4 h-16 text-xl items-center justify-center">
          {situationsSubject && (
            <div className="py-3 px-5 font-bold bg-dodger-blue text-2xl text-white rounded text-center transition w-fit">
              {situationsSubject}
            </div>
          )}
          <div className="flex space-x-4 h-16 text-xl">
            {situations.map((situation, index) => (
              <div
                key={index}
                className="p-4 bg-dodger-blue text-white rounded cursor-pointer transition flex items-center space-x-2 h-full"
              >
                <button
                  onClick={() => handleRemoveSituation(index)}
                  className="font-bold text-white bg-coral size-9 rounded p-1 hover:bg-deep-coral focus:outline-none"
                >
                  &times;
                </button>
                <span onClick={() => handleEditClick(index)}>
                  {situation.text}
                </span>
              </div>
            ))}

            {situations.length > 0 && (
              <div className="p-4 bg-dodger-blue text-black rounded space-x-3 cursor-pointer  flex items-center">
                <input
                  type="text"
                  placeholder="Add new category..."
                  value={newSituationText}
                  onChange={(e) => setNewSituationText(e.target.value)}
                  className="p-2 rounded border border-gray-300"
                />
                <button
                  className="font-bold flex items-center justify-center size-9 p-1 bg-green-300 hover:bg-green-400 text-white rounded cursor-pointer"
                  onClick={handleAddSituation}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* width full is only of this small size */}
      {situations.length === 0 && (
        <textarea
          className="w-[30%] p-4 border text-lg rounded-lg shadow-lg focus:outline-none focus:ring focus:ring-indigo-500"
          rows="2"
          placeholder="Type a financial situation you would like to predict for here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      )}
      {!showTransactionList && situationsSubject && <div></div>}
      <button
        className="px-5 py-3 text-2xl font-semibold text-white bg-dodger-blue rounded-lg hover:bg-blue-500"
        onClick={
          showTransactionList
            ? resetState
            : isEditing
            ? handleFinalGenerateResponse
            : handleInitialGenerateResponse
        }
        disabled={loading}
      >
        {loading
          ? isEditing
            ? "Sending..."
            : "Generating..."
          : showTransactionList
          ? "Predict A New Situation"
          : isEditing
          ? "Send Modified Categories"
          : "Generate Categories"}
      </button>
    </div>
  );
}

export default LLMInterface;

//Maybe instruction thing always at top
//Transaction list should order with newest first

//I need to fix the gap at the top for the unloaded stuff not making it center
//I might move subject to the top line and remove the word subject
//different color for subject too maybe?
