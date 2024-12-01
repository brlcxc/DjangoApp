function UserProfile2(){
    
    return(
        <div className="w-full h-full flex flex-col justify-center items-center bg-custom-gradient animate-gradient">User</div>
    )
}

import React, { useState } from 'react';

function UserProfile() {
  // State variables for user information
  const [profilePicture, setProfilePicture] = useState('https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Profile%20Picture');
  const [displayName, setDisplayName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');

  // Handlers for form submissions
  const handleDisplayNameChange = (e) => {
    e.preventDefault();
    // Implement logic to update display name
    alert('Display name updated successfully!');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Implement logic to update password
    alert('Password updated successfully!');
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    // Implement logic to update email
    alert('Email updated successfully!');
  };

  const handleResendVerification = () => {
    // Implement logic to resend email verification
    alert('Verification email resent!');
  };

  return (
    <div className="bg-custom-gradient animate-gradient min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl overflow-hidden shadow-lg">
        {/* Profile Header */}
        <div className="flex items-center mb-6">
          <img
            src={profilePicture}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-gray-600">{email}</p>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Change Display Name */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Change Display Name</h2>
            <form onSubmit={handleDisplayNameChange}>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="New Display Name"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
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
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Current Password"
              />
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="New Password"
              />
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Confirm New Password"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="New Email Address"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
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
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
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
