import React, { useState } from "react";
import api from "../api";

//I need a way to indicate verified

function UserProfile() {
  // Feel free to rip out all of these handlers, they do not have souls

  // State variables for user information
  const [profilePicture, setProfilePicture] = useState(
    "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Profile%20Picture"
  );
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("DISPLAY_NAME")
  );
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [email, setEmail] = useState(localStorage.getItem("USER_EMAIL"));
  const [newEmail, setNewEmail] = useState(email);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handlers for form submissions
  const handleDisplayNameChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { display_name: newDisplayName };

    try {
      const response = await api.patch("/api/users/me/", data);
      alert("Display name updated successfully!");
      setDisplayName(newDisplayName);
      localStorage.setItem("DISPLAY_NAME", newDisplayName); // Update local storage
    } catch (error) {
      console.error("Error updating display name:", error);
      alert("Failed to update display name.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {};
    if (newPassword && newPassword === confirmPassword)
      data.password = newPassword;

    try {
      const response = await api.patch("/api/users/me/", data);
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      alert(
        `Failed to update password: ${error.response.data.non_field_errors}`
      );
    } finally {
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { email: newEmail };

    try {
      const response = await api.patch("/api/users/me/", data);
      alert("Email updated successfully!");
      setEmail(newEmail);
      localStorage.setItem("USER_EMAIL", newEmail); // Update local storage
    } catch (error) {
      console.error("Error updating email:", error);
      alert("Failed to update email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
  
    try {
      const response = await api.post("/api/resend-verification/", { email });
  
      if (response.status === 200) {
        alert(response.data.detail); // Show success message
      } else {
        alert(response.data.detail); // Show error message
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      alert(error.response.data.detail);
    }
  };
  
  return (
    <div className="bg-custom-gradient animate-gradient min-h-screen flex items-center justify-center font-archivo">
      <div className="bg-white rounded-xl p-6 w-full max-w-5xl overflow-hidden shadow-lg">
        {/* Profile Header */}
        <div className="flex items-center mb-6">
          {/* Profile Picture */}
          {/* <img
            src={profilePicture}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover mr-4"
          /> */}
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-gray-600">{email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Change Display Name */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Change Display Name</h2>
            <form onSubmit={handleDisplayNameChange}>
              <input
                type="text"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="New Display Name"
              />
              <button
                type="submit"
                className="w-full bg-dodger-blue hover:bg-blue-500 text-white p-2 rounded"
              >
                Update Display Name
              </button>
            </form>
          </section>

          {/* Change Password */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Current Password"
                disabled={loading}
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="New Password"
                disabled={loading}
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Confirm New Password"
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full bg-dodger-blue hover:bg-blue-500 text-white p-2 rounded"
              >
                Update Password
              </button>
            </form>
          </section>

          {/* Change Email */}
          <section>
            <h2 className="text-xl font-semibold mb-2 mt-auto">Change Email</h2>
            <form onSubmit={handleEmailChange}>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="New Email Address"
              />
              <button
                type="submit"
                className="w-full bg-dodger-blue hover:bg-blue-500 text-white p-2 rounded"
              >
                Update Email
              </button>
            </form>
          </section>

          {/* Resend Email Verification */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Email Verification</h2>
            <button
              onClick={handleResendVerification}
              className="w-full bg-green-300 hover:bg-green-400 text-white p-2 rounded"
            >
              Resend Verification Email
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
