import React, { useState, useEffect, useContext } from "react";
import { GroupContext } from "../GroupContext"; 

const GroupRow = ({ group, isChecked, onCheckChange }) => (
  <div className="flex items-center py-3 pl-2 border-b hover:bg-gray-100 transition text-black">
    <input
      type="checkbox"
      className="mr-3"
      checked={isChecked}
      onChange={(e) => onCheckChange(group.group_id, e.target.checked)}
    />
    <div>{group.group_name}</div>
  </div>
);

const GroupList = () => {
  const { groups, loading, error } = useContext(GroupContext);
  const [selectedGroups, setSelectedGroups] = useState([]);

  useEffect(() => {
    if (groups && groups.length > 0) {
      // Set all groups as selected when groups are loaded
      setSelectedGroups(groups.map((group) => group.group_id));
    }
  }, [groups]);

  const handleCheckChange = (groupId, isChecked) => {
    setSelectedGroups((prevSelectedGroups) =>
      isChecked
        ? [...prevSelectedGroups, groupId]
        : prevSelectedGroups.filter((id) => id !== groupId)
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5 text-black">Group List</h1>

      <div className="overflow-y-auto max-h-[350px]">
        {groups && groups.length > 0 ? (
          groups.map((group) => (
            <GroupRow
              key={group.group_id}
              group={group}
              isChecked={selectedGroups.includes(group.group_id)}
              onCheckChange={handleCheckChange}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">No groups found</div>
        )}
      </div>
    </div>
  );
};

export default GroupList;
