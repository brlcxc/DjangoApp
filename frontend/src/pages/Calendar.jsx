import Month from "../components/Month";
import { getMonth } from "../components/util";
import { useState } from "react";

function Calendar(){
    const [currentMonth, setCurrentMonth] = useState(getMonth());
    return(
        <div className="w-full h-full flex">
            <Month month={currentMonth}/>
        </div>
    )
}

export default Calendar;