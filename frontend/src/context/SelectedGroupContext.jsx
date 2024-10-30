import React, { createContext, useContext, useState } from 'react';

export const SelectedGroupContext = createContext();

export const useSelectedGroup = () => useContext(SelectedGroupContext);

export function SelectedGroupProvider({ children }) {
  const [selectedGroups, setSelectedGroups] = useState([]);

  const toggleSelectedGroup = (group) => {
    setSelectedGroups((prevSelectedGroups) =>
      prevSelectedGroups.some((g) => g.group_id === group.group_id)
        ? prevSelectedGroups.filter((g) => g.group_id !== group.group_id)
        : [...prevSelectedGroups, group]
    );
  };

  const selectedGroupUUIDs = selectedGroups.map((group) => group.group_id);

  return (
    <SelectedGroupContext.Provider value={{ selectedGroups, toggleSelectedGroup, selectedGroupUUIDs }}>
      {children}
    </SelectedGroupContext.Provider>
  );
}
