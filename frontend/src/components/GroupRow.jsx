import React from "react";
import { useSelectedGroup } from "../context/GroupModifyContext";

const GroupRow = React.memo(({ group }) => {
  const { selectedGroup, toggleSelectedGroup } = useSelectedGroup();

  const handleCheckChange = () => {
    toggleSelectedGroup(group); // Pass the full group object
  };

  return (
    <div
      className={`flex items-center py-3 pl-3 border-b hover:bg-gray-100 transition text-black ${
        selectedGroup?.group_id === group.group_id ? 'bg-gray-200' : ''
      }`}
    >
      <input
        type="checkbox"
        className="mr-3"
        checked={selectedGroup?.group_id === group.group_id}
        onChange={handleCheckChange}
      />
      <div className="flex-1">{group.group_name}</div>
      <div className="flex-1">{group.description}</div>
    </div>
  );
});

export default GroupRow