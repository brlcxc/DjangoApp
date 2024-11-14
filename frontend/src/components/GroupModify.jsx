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
      <div className="grid grid-cols-2">
        <div>
          <div className="py-3 pl-3 border-b font-semibold text-left bg-dodger-blue text-white">
            Current Members
          </div>
          <div className="py-3 pl-2 border-b hover:bg-gray-100 transition text-black">
            <ul>
              {selectedGroup.members.map((member) => (
                <li key={member.id} className="text-gray-700 flex items-center">
                  {isOwner && (
                    <button className="font-bold text-white text-l bg-coral mr-3 size-5 rounded p-1 hover:bg-deep-coral focus:outline-none">
                      -
                    </button>
                  )}
                  {member.display_name}{" "}
                  <span className="text-gray-500">({member.email})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <button
        className="bg-coral hover:bg-deep-coral text-white font-semibold py-2 px-4 rounded shadow"
        onClick={handleDelete}
      >
        {isOwner ? "Delete Group" : "Leave Group"}
      </button>
      <button className="bg-green-300 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded shadow">
        Invite
      </button>
    </div>
  );
};

export default GroupModify;

//I need the search user add user thing here too     add members section    invite button selected members ection
//invite message too

//still need the edit ability
//maybe - button on list of users

// <button
// onClick={() => handleRemoveSituation(index)}
// className="font-bold text-white bg-coral size-9 rounded p-1 hover:bg-deep-coral focus:outline-none"
// >
// &times;
// </button>

//maybe way to differentia between between recently added and new?

//maybe change size of colums?
