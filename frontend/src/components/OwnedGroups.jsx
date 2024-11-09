import React, { useEffect, useContext, useCallback, useState } from "react";
import { GroupContext } from "../context/GroupContext";

const GroupRow = React.memo(({ group, isChecked, onCheckChange }) => (
  <div className="flex items-center py-3 pl-3 border-b hover:bg-gray-100 transition text-black">
    <input type="checkbox" className="mr-3" />
    <div className="flex-1">{group.group_name}</div>
    <div className="flex-1">{group.description}</div>
  </div>
));

const OwnedGroups = () => {
  const { groups, loading, error } = useContext(GroupContext);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const uuid = localStorage.getItem("USER_ID");

  const filteredGroups = groups?.filter(
    (group) => group.group_owner_id === uuid
  );

  console.log(uuid);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5 text-black">Owned Groups</h1>
      <div className="grid grid-cols-2 py-3 pl-3 border-b font-semibold text-left bg-dodger-blue text-white">
        <div>Group</div>
        <div>Description</div>
      </div>
      <div className="overflow-y-auto max-h-[350px]">
        {filteredGroups && filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <GroupRow key={group.group_id} group={group} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">No groups found</div>
        )}
      </div>
    </div>
  );
};

export default OwnedGroups;
