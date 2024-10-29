import React, { useState, useEffect } from "react";
import Charts from "../components/Charts";
import TransactionAdd from "../components/TransactionAdd";
import TransactionList from "../components/TransactionList";
import "tailwindcss/tailwind.css"; // Make sure Tailwind CSS is properly imported :)
import GroupList from "../components/toggle";
import { TransactionProvider } from "../TransactionContext";
import { GroupProvider } from "../GroupContext";
import { SelectedGroupProvider, useSelectedGroup } from '../SelectedGroupContext';


function Budget() {
  const style = "bg-white p-8 mb-8 rounded-xl shadow-lg mb-8 ";

  return (
    <GroupProvider>
      <SelectedGroupProvider>
        <TransactionProvider
          groupUUIDs={"c72d0191-c970-4c55-b943-178d564300d7"}
        >
          <div className="grid grid-cols-2 gap-8 size-full p-8 bg-custom-gradient animate-gradient">
            <div>
              {/* List Section */}
              <div className={`${style} h-[70%]`}>
                <TransactionList />
              </div>
              {/* Form Section */}
              <div className={`${style} h-[25%]`}>
                <TransactionAdd />
              </div>
            </div>
            <div>
              {/* Chart Section */}
              <div className={`${style} h-[70%]`}>
                <Charts />
              </div>
              {/* Group Section */}
              <div className={`${style} h-[25%]`}>
                <GroupList />
              </div>
            </div>
          </div>
        </TransactionProvider>
      </SelectedGroupProvider>
    </GroupProvider>
  );
}

export default Budget;
