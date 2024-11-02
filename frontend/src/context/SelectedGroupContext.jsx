import React, { createContext, useContext, useState, useEffect } from 'react';
import { GroupContext } from './GroupContext'; // Import GroupContext

export const SelectedGroupContext = createContext();

export const useSelectedGroup = () => useContext(SelectedGroupContext);

export function SelectedGroupProvider({ children }) {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const { groups } = useContext(GroupContext); // Access groups from GroupContext

  // Effect to select all groups on load
  useEffect(() => {
    if (groups.length > 0) {
      setSelectedGroups(groups); // Select all groups
    }
  }, [groups]);

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
