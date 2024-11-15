import React, { useState, useEffect } from "react";
import api from "../api"; // Adjust the path to your API utility

const GroupAdd = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteMessage, setInviteMessage] = useState(""); // New state for invite message
  const [searchQuery, setSearchQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/groups/", {
        group_name: groupName,
        description,
        members: selectedUsers.map((user) => user.id),
        invite_message: inviteMessage, // Include invite message in the payload
      });
      console.log("Group created:", response.data);
      setGroupName("");
      setDescription("");
      setInviteMessage("");
      setSelectedUsers([]);
    } catch (err) {
      console.error("Error creating group:", err);
      setError("Failed to create group");
    }
  };

  return (
    <div className="h-full overflow-hidden">
      <h1 className="text-2xl font-bold mb-5 text-black">Create New Group</h1>
      <div className="h-[80%]">
        <div className="grid grid-cols-2 gap-2 h-full">
          <div className="grid grid-rows-2">
            <div className="grid grid-rows-2">
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-m"
                  placeholder="Enter group name"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Description
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="mt-1 block w-full border rounded-md px-3 py-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-m"
                  placeholder="Enter group description"
                />
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
          </div>
          <div className="grid grid-rows-2 overflow-hidden">
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
              <div className="overflow-y-auto h-32">
                {loadingUsers && (
                  <p className="text-blue-500">Loading users...</p>
                )}
                {userResults.slice(0, 4).map((user) => (
                  <div className="py-3 pl-2 border-b hover:bg-gray-100 transition text-black">
                    <li
                      key={user.id}
                      className="text-gray-700 flex items-center"
                    >
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
          </div>
        </div>
      </div>
      <button
        type="submit"
        onClick={handleSubmit}
        className="bg-green-300 hover:bg-green-400 w-full h-12 text-lg object-bottom bg-dodger-blue text-white py-2 px-4 rounded-md"
      >
        Create Group
      </button>
    </div>
  );
};

export default GroupAdd;

//I need name, desc, ad list of users with search?

//title search bar for groups as add memebrs

//select the data which you find most closely alligns with your spending

//maybe selected group and add group can be given special space
