import Month from "../components/Month";
import { getMonth } from "../components/util";
import { useState } from "react";

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  return (
    <div className="size-full p-8 bg-custom-gradient animate-gradient">
      <div className="size-full flex bg-white rounded-xl">
        <div className="size-full flex p-4">
          <Month month={currentMonth} />
        </div>
      </div>
    </div>
  );
}

export default Calendar;
