import { useSelectedGroup } from '../context/GroupModifyContext'; // Adjust the path as necessary

const GroupModify = ({ groups = [], onDelete }) => {
  const { selectedGroup } = useSelectedGroup();
//Note: this actually just returns ID
  console.log("selectedGroup");
  console.log(selectedGroup);

  if (!selectedGroup) {
    return null; // No group selected, display nothing
  }

  // const group = groups.find((g) => g.group_id === selectedGroup);

  // console.log("group");
  // console.log(group);

  // if (!group) {
  //   return null; // Group not found, display nothing
  // }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the group: ${selectedGroup.group_name}?`)) {
      onDelete(selectedGroup.group_id);
    }
  };

  return (
    <div className="border rounded-lg shadow-md p-6 bg-white mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedGroup.group_name}</h2>
      <p className="text-gray-600 mb-4">{selectedGroup.description}</p>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Members:</h3>
      {/* <ul className="list-disc list-inside mb-4">
        {group.members.map((member) => (
          <li key={member.id} className="text-gray-700">
            {member.display_name} <span className="text-gray-500">({member.email})</span>
          </li>
        ))}
      </ul> */}
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
