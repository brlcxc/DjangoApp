import Month from "../components/Month";
import Week from "../components/Week";
import { getMonth } from "../components/util";
import dayjs from 'dayjs';
import { useState } from "react";

function Calendar() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [viewMode, setViewMode] = useState("month");
  const [currentWeek, setCurrentWeek] = useState(getMonth()[0]);

  const toggleViewMode = () => {
    setViewMode((prev)=>(prev === "month" ? "week" : "month"));
  }

  const handleAdjacentMonth = (isNext) => {
    const newMonthIndex = isNext ? (currentMonthIndex + 1) % 12 : (currentMonthIndex + 11) % 12;
    setCurrentMonthIndex(newMonthIndex);
    const newMonth = getMonth(newMonthIndex);
    setCurrentMonth(newMonth);
    setCurrentWeek(newMonth[0]);
  }

  const handleMonthSelect = (event) => {
    const newMonthIndex = parseInt(event.target.value, 10);
    setCurrentMonthIndex(newMonthIndex);
    const newMonth = getMonth(newMonthIndex);
    setCurrentMonth(newMonth);
    setCurrentWeek(newMonth[0]);
  }

  const handleAdjacentWeek = (isNext) => {
    const currentWeekIndex = currentMonth.findIndex((week)=>week[0].isSame(currentWeek[0],"day"));
    const newWeekIndex = isNext ? (currentWeekIndex + 1) % currentMonth.length : (currentWeekIndex - 1 + currentMonth.length) % currentMonth.length;
    setCurrentWeek(currentMonth[newWeekIndex]);
  }

  return (
    <div className="h-screen flex flex-col p-8 bg-custom-gradient animate-gradient">
      <div className="flex justify-between items-center mb-4">
        
        <button onClick={viewMode === "month" ? () => handleAdjacentMonth(false) : () => handleAdjacentWeek(false)}
          className="bg-gray-200 p-2 rounded hover:bg-gray-300"
        >
          &lt; Prev
        </button>
        
        <div className="flex gap-2">
          <button onClick={toggleViewMode} className="bg-gray-200 p-2 rounded hover:bg-gray-300">
            {viewMode === "month" ? "Switch to Week View" : "Switch to Month View"}
          </button>
          <select value={currentMonthIndex} onChange={handleMonthSelect} className="bg-white border border-gray-300 rounded p-2">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {dayjs(new Date(dayjs().year(), i)).format("MMMM")}
              </option>
            ))}
          </select>
        </div>
        
        <button onClick={viewMode === "month" ? () => handleAdjacentMonth(true) : () => handleAdjacentWeek(true)}
          className="bg-gray-200 p-2 rounded hover:bg-gray-300"
        >
          Next &gt;
        </button>
      </div>

      <div className="w-full flex-1 bg-white rounded-xl">
        <div className="size-full flex p-4">
          {viewMode === "month" ? (
            <Month month={currentMonth} />
          ) : (
            <Week week={currentWeek} />
          )}
        </div>
      </div>
    
    </div>
  );
}

export default Calendar;
