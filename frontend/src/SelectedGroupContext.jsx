import React, { createContext, useContext, useState } from 'react';

export const SelectedGroupContext = createContext();

export const useSelectedGroup = () => useContext(SelectedGroupContext);

export function SelectedGroupProvider({ children }) {
  const [selectedGroups, setSelectedGroups] = useState([]);

  const toggleSelectedGroup = (group) => {
    setSelectedGroups((prevSelectedGroups) =>
      prevSelectedGroups.includes(group)
        ? prevSelectedGroups.filter((g) => g !== group)
        : [...prevSelectedGroups, group]
    );
  };

  return (
    <SelectedGroupContext.Provider value={{ selectedGroups, toggleSelectedGroup }}>
      {children}
    </SelectedGroupContext.Provider>
  );
}
