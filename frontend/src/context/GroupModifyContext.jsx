import React, { createContext, useState, useContext, useEffect } from 'react';

const GroupModifyContext = createContext();

export const GroupModifyProvider = ({ children, groups = [] }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const toggleSelectedGroup = (group) => {
    if (selectedGroup?.group_id === group.group_id) {
      setSelectedGroup(null); // Deselect the group if it's already selected
    } else {
      setSelectedGroup(group); // Select the new group
    }
  };

  // Select the first group when the component mounts, if no group is selected
  useEffect(() => {
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0]); // Select the first group by default
    }
  }, [groups]); // Only depend on groups

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