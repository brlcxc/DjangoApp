import { useSelectedGroup } from "../context/GroupModifyContext"; // Adjust the path as necessary
import React, { useState, useEffect } from "react";

const GroupModify = ({ groups = [], onDelete }) => {
  const { selectedGroup } = useSelectedGroup();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteMessage, setInviteMessage] = useState(""); // New state for invite message
  const [searchQuery, setSearchQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [error, setError] = useState(null);
  if (!selectedGroup) {
    return null; // No group selected, display nothing
  }
  const fetchUsers = async (query) => {
    if (!query) {
      setUserResults([]);
      return;
    }

    setLoadingUsers(true);
    try {
      const response = await api.get("/api/users/");
      const filteredResults = response.data.filter(
        (user) =>
          user.display_name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );

      setUserResults(filteredResults);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchUsers(query);
  };

  const handleUserSelect = (user) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

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
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="py-3 pl-3 border-b font-semibold text-left bg-dodger-blue text-white">
            Current Members
          </div>
          <ul>
            {selectedGroup.members.map((member) => (
              <div className="py-3 pl-2 border-b hover:bg-gray-100 transition text-black">
                <li key={member.id} className="text-gray-700 flex items-center">
                  {isOwner && (
                    <button className="flex font-bold text-white text-l bg-coral mr-3 size-5 justify-center items-center rounded p-1 hover:bg-deep-coral focus:outline-none">
                      -
                    </button>
                  )}
                  {member.display_name}{" "}
                  <span className="text-gray-500">({member.email})</span>
                </li>
              </div>
            ))}
          </ul>

          <button
            className="bg-coral hover:bg-deep-coral text-white font-semibold py-2 px-4 rounded shadow"
            onClick={handleDelete}
          >
            {isOwner ? "Delete Group" : "Leave Group"}
          </button>
        </div>
        <div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Add Users
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleUserSearch}
              placeholder="Search by name or email"
              className="mt-1 border px-3 py-2  block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-m"
            />{" "}
            <div className="overflow-y-auto h-4">
              {loadingUsers && (
                <p className="text-blue-500">Loading users...</p>
              )}
              {userResults.slice(0, 4).map((user) => (
                <div className="py-3 pl-2 border-b hover:bg-gray-100 transition text-black">
                  <li key={user.id} className="text-gray-700 flex items-center">
                    <button
                      type="button"
                      onClick={() => handleUserSelect(user)}
                      className="flex font-bold text-white text-l bg-green-300 hover:bg-green-400 mr-3 size-5 justify-center items-center rounded p-1 focus:outline-none"
                    >
                      +
                    </button>
                    <span>
                      {user.display_name} ({user.email})
                    </span>
                  </li>
                </div>
              ))}{" "}
            </div>
          </div>
          <div>
            <div className="py-3 pl-3 border-b font-semibold text-left bg-dodger-blue text-white">
              Selected Members
            </div>
            <div className="overflow-y-auto h-4">
              <ul>
                {selectedUsers.map((user) => (
                  <div className="py-3 pl-2 border-b hover:bg-gray-100 transition text-black">
                    <li
                      key={user.id}
                      className="text-gray-700 flex items-center"
                    >
                      <button
                        type="button"
                        onClick={() => handleUserRemove(user.id)}
                        className="flex font-bold text-white text-l bg-coral mr-3 size-5 justify-center items-center rounded p-1 hover:bg-deep-coral focus:outline-none"
                      >
                        -
                      </button>
                      <span>
                        {user.display_name} ({user.email})
                      </span>
                    </li>{" "}
                  </div>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Invite Message
            </label>
            <textarea
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              className="mt-1 border block w-full h-[75%] rounded-md px-3 py-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-m resize-none"
              placeholder="Enter invite message"
            />
          </div>
          <button className="bg-green-300 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded shadow">
            Invite
          </button>
        </div>
      </div>

      {/* <div>
        <label className="block text-lg font-medium text-gray-700">
          Add Users
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleUserSearch}
          placeholder="Search by name or email"
          className="mt-1 border px-3 py-2  block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-m"
        />{" "}
        <div className="overflow-y-auto h-32">
          {loadingUsers && <p className="text-blue-500">Loading users...</p>}
          {userResults.slice(0, 4).map((user) => (
            <div className="py-3 pl-2 border-b hover:bg-gray-100 transition text-black">
              <li key={user.id} className="text-gray-700 flex items-center">
                <button
                  type="button"
                  onClick={() => handleUserSelect(user)}
                  className="flex font-bold text-white text-l bg-green-300 hover:bg-green-400 mr-3 size-5 justify-center items-center rounded p-1 focus:outline-none"
                >
                  +
                </button>
                <span>
                  {user.display_name} ({user.email})
                </span>
              </li>
            </div>
          ))}{" "}
        </div>
      </div>
      <div>
              <div className="py-3 pl-3 border-b font-semibold text-left bg-dodger-blue text-white">
                Selected Members
              </div>
              <div className="overflow-y-auto h-36">

              <ul>
                {selectedUsers.map((user) => (
                  <div className="py-3 pl-2 border-b hover:bg-gray-100 transition text-black">
                    <li
                      key={user.id}
                      className="text-gray-700 flex items-center"
                    >
                      <button
                        type="button"
                        onClick={() => handleUserRemove(user.id)}
                        className="flex font-bold text-white text-l bg-coral mr-3 size-5 justify-center items-center rounded p-1 hover:bg-deep-coral focus:outline-none"
                      >
                        -
                      </button>
                      <span>
                        {user.display_name} ({user.email})
                      </span>
                    </li>{" "}
                  </div>
                ))}
              </ul>
              </div>
            </div>
      <div>
        <label className="block text-lg font-medium text-gray-700">
          Invite Message
        </label>
        <textarea
          value={inviteMessage}
          onChange={(e) => setInviteMessage(e.target.value)}
          className="mt-1 border block w-full h-[75%] rounded-md px-3 py-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-m resize-none"
          placeholder="Enter invite message"
        />
      </div> */}
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
