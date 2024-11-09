import React, { useState, useEffect } from "react";
import api from "../api"; // Adjust the path to your API utility

const GroupAdd = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
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

      // Filter results based on the search query
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
      });
      console.log("Group created:", response.data);
      setGroupName("");
      setDescription("");
      setSelectedUsers([]);
    } catch (err) {
      console.error("Error creating group:", err);
      setError("Failed to create group");
    }
  };

  return (
    <div className="h-full overflow-hidden">
      <h1 className="text-2xl font-bold mb-5 text-black">Create New Group</h1>
      <form className="h-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2  gap-2 h-full">
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
                className="mt-1 block w-full px-2 py-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-m"
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
                className="mt-1 block w-full rounded-md px-2 py-1 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-m"
                placeholder="Enter group description"
              />
            </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Invite Message
              </label>
            </div>
          </div>
          <div className="grid grid-rows-2">
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Search Users
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleUserSearch}
                  placeholder="Search by name or email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            {loadingUsers && <p className="text-blue-500">Loading users...</p>}
            {userResults.slice(0, 3).map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center bg-gray-100 rounded-md p-2"
              >
                <span>
                  {user.display_name} ({user.email})
                </span>
                <button
                  type="button"
                  onClick={() => handleUserSelect(user)}
                  className="text-blue-500 hover:underline"
                >
                  Add
                </button>
              </li>
            ))}
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Selected Members
              </h3>
              <ul className="mt-2 space-y-2">
                {selectedUsers.map((user) => (
                  <li
                    key={user.id}
                    className="flex justify-between items-center bg-blue-50 rounded-md p-2"
                  >
                    <span>
                      {user.display_name} ({user.email})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUserRemove(user.id)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Group
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default GroupAdd;

//I need name, desc, ad list of users with search?

//title search bar for groups as add memebrs

//select the data which you find most closely alligns with your spending
