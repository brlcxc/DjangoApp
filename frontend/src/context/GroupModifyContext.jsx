import React, { createContext, useState, useContext } from 'react';

const GroupModifyContext = createContext();

export const GroupModifyProvider = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const toggleSelectedGroup = (groupId) => {
    setSelectedGroup((prev) => (prev === groupId ? null : groupId));
  };

  return (
    <GroupModifyContext.Provider value={{ selectedGroup, toggleSelectedGroup }}>
      {children}
    </GroupModifyContext.Provider>
  );
};

export const useSelectedGroup = () => useContext(GroupModifyContext);
