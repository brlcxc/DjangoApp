import React from "react";
import Charts from "../components/Charts";
import TransactionAdd from "../components/TransactionAdd";
import TransactionList from "../components/TransactionList";
import Toggle from "../components/Toggle";

function Budget() {
  const style = "bg-white p-8 rounded-xl shadow-lg";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-custom-gradient min-h-screen">
      <div className="flex flex-col gap-8">
        <div className={`${style} h-[70%] md:h-[70%]`}>
          <TransactionList />
        </div>
        <div className={`${style} h-[25%] md:h-[25%]`}>
          <TransactionAdd />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className={`${style} h-[70%] md:h-[70%]`}>
          <Charts />
        </div>
        <div className={`${style} h-[25%] md:h-[25%]`}>
          <Toggle />
        </div>
      </div>
    </div>
  );
}

export default Budget;
