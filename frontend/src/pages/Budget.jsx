import React, { useState, useEffect } from "react";
import Charts from "../components/Charts";
import TransactionAdd from "../components/TransactionAdd";
import TransactionList from "../components/TransactionList";
import "tailwindcss/tailwind.css"; // Make sure Tailwind CSS is properly imported :)
import ToggleList from "../components/toggle";
import { TransactionProvider } from '../TransactionContext'; // Adjust the path as needed

function Budget({ groupUUIDs }) {
  const style = "bg-white p-8 mb-8 rounded-xl shadow-lg mb-8 ";

  return (
    <TransactionProvider groupUUIDs={"c72d0191-c970-4c55-b943-178d564300d7"}>
      <div className="grid grid-cols-2 gap-8 size-full p-8 bg-custom-gradient animate-gradient">
      <div>
        {/* List Section */}
        <div className={`${style} h-[70%]`}>
          <TransactionList/>
        </div>
        {/* Form Section */}
        <div className={`${style} h-[25%]`}>
          <TransactionAdd/>
        </div>
      </div>
      <div>
        {/* Chart Section */}
        <div className={`${style} h-[70%]`}>
          {/* <Charts /> */}
        </div>
        {/* Group Section */}
        <div className={`${style} h-[25%]`}>
          <ToggleList />
        </div>
      </div>
    </div>
    </TransactionProvider>
  );
}

export default Budget;
