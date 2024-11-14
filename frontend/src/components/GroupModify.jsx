import { useSelectedGroup } from "../context/GroupModifyContext"; // Adjust the path as necessary

const GroupModify = ({ groups = [], onDelete }) => {
  const { selectedGroup } = useSelectedGroup();

  if (!selectedGroup) {
    return null; // No group selected, display nothing
  }

  console.log(selectedGroup);

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the group: ${selectedGroup.group_name}?`
      )
    ) {
      onDelete(selectedGroup.group_id);
    }
  };

  const uuid = localStorage.getItem("USER_ID");
  const isOwner = selectedGroup.group_owner_id === uuid;

  return (
    <div>
      <h1 className="text-2xl font-bold text-black">
        {selectedGroup.group_name}
      </h1>
      <p className="text-gray-600 text-xl mb-4">{selectedGroup.description}</p>
      <p className="text-gray-700 font-semibold text-xl mb-4">
        Owner: <span className="font-normal">{selectedGroup.owner_name}</span>
        <span className="text-gray-500">({selectedGroup.owner_email})</span>
      </p>
      <div className="py-3 pl-3 border-b font-semibold text-left bg-dodger-blue text-white">
        Members
      </div>
      <div className="py-3 pl-2 border-b hover:bg-gray-100 transition text-black">
        <ul className="list-disc list-inside">
          {selectedGroup.members.map((member) => (
            <li key={member.id} className="text-gray-700">
              {member.display_name}{" "}
              <span className="text-gray-500">({member.email})</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="bg-coral hover:bg-deep-coral text-white font-semibold py-2 px-4 rounded shadow"
        onClick={handleDelete}
      >
        {isOwner ? "Delete Group" : "Leave Group"}
      </button>
    </div>
  );
};

export default GroupModify;
