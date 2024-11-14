import React, { createContext, useState, useContext } from 'react';

const GroupModifyContext = createContext();

export const GroupModifyProvider = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const toggleSelectedGroup = (group) => {
    setSelectedGroup((prev) => (prev?.group_id === group.group_id ? null : group));
  };

  return (
    <GroupModifyContext.Provider value={{ selectedGroup, toggleSelectedGroup }}>
      {children}
    </GroupModifyContext.Provider>
  );
};

export const useSelectedGroup = () => useContext(GroupModifyContext);

//group context for getting all groups
//group modify modify for the one selected one 

//I need to pass the group uuid from group to group modify
//that is how I will display my info 

//Later for changing groups I might need to add modify features to the group context

//I think set selected group can be sent out?


//maybe I need to bring in another group context or add the group modify stuff to it?