import React, { useEffect, useContext, useCallback, useState } from "react";
import { useSelectedGroup } from "../context/SelectedGroupContext";
import { GroupContext } from "../context/GroupContext";

//change checked color to proper blue
const GroupRow = React.memo(({ group, isChecked, onCheckChange }) => (
  <div className="flex items-center py-3 pl-2 border-b hover:bg-gray-100 transition text-black">
    <input
      type="checkbox"
      className="mr-3"
      checked={isChecked}
      onChange={(e) => onCheckChange(group, e.target.checked)} // Pass the whole group object
    />
    <div>{group.group_name}</div>
    {/* <div>{group.description}</div> */}
  </div>
));

const Toggle = () => {
  const { groups, loading, error } = useContext(GroupContext);
  const { selectedGroups, toggleSelectedGroup } = useSelectedGroup();
  const [hasInitialized, setHasInitialized] = useState(false); // Track if initial toggle has been done

  useEffect(() => {
    if (!hasInitialized && groups && groups.length > 0) {
      groups.forEach((group) => {
        if (!selectedGroups.some((g) => g.group_id === group.group_id)) {
          toggleSelectedGroup(group);
        }
      });
      setHasInitialized(true); // Set to true after initial selection
    }
  }, [groups, toggleSelectedGroup, selectedGroups, hasInitialized]);

  const handleCheckChange = useCallback(
    (group, isChecked) => {
      toggleSelectedGroup(group); // Use toggle function from context
    },
    [toggleSelectedGroup]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5 text-black">Group List</h1>

      <div className="overflow-y-auto h-32">
        {groups && groups.length > 0 ? (
          groups.map((group) => (
            <GroupRow
              key={group.group_id}
              group={group}
              isChecked={selectedGroups.some(
                (g) => g.group_id === group.group_id
              )} // Check if group is selected
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

export default Toggle;
