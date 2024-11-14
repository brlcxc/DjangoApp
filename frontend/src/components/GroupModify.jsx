import React, { useContext } from 'react';
import { useSelectedGroup } from '../contexts/GroupModifyContext'; // Adjust the path as necessary

const GroupModify = ({ onDelete }) => {
  const { selectedGroup } = useSelectedGroup();

  const group = groups.find(g => g.group_id === selectedGroup);

  if (!selectedGroup) {
    return <p className="text-gray-500">No group selected.</p>;
  }

  if (!group) {
    return <p className="text-gray-500">Group not found.</p>;
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the group: ${group.group_name}?`)) {
      onDelete(group.group_id);
    }
  };

  return (
    <div className="border rounded-lg shadow-md p-6 bg-white mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{group.group_name}</h2>
      <p className="text-gray-600 mb-4">{group.description}</p>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Members:</h3>
      <ul className="list-disc list-inside mb-4">
        {group.members.map(member => (
          <li key={member.id} className="text-gray-700">
            {member.display_name} <span className="text-gray-500">({member.email})</span>
          </li>
        ))}
      </ul>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow"
        onClick={handleDelete}
      >
        Delete Group
      </button>
    </div>
  );
};

export default GroupModify;
