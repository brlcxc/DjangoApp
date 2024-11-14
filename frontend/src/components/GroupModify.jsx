import { useSelectedGroup } from '../context/GroupModifyContext'; // Adjust the path as necessary

const GroupModify = ({ groups = [], onDelete }) => {
  const { selectedGroup } = useSelectedGroup();

  if (!selectedGroup) {
    return null; // No group selected, display nothing
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the group: ${selectedGroup.group_name}?`)) {
      onDelete(selectedGroup.group_id);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5 text-black">{selectedGroup.group_name}</h1>
      <p className="text-gray-600 mb-4">{selectedGroup.description}</p>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Members:</h3>
      <ul className="list-disc list-inside mb-4">
        {selectedGroup.members.map((member) => (
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
