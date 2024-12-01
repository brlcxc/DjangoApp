import React from "react";
import Day from "./Day";

function Week({ week }) {
  return (
    <div className="flex-1 grid grid-cols-7">
      {week.map((day, i) => (<Day day={day} key={i}/>))}
    </div>
  );
}

export default Week;