import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN, ONBOARDING_COMPLETION } from "../constants";

export default function AuthForm({ route, isRegistration }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const requestData = { email, password };
  
      if (isRegistration) {
        if (password !== passwordConfirm) {
          alert("Passwords do not match");
          setLoading(false);
          return;
        }
        requestData.display_name = displayName;
        requestData.password1 = password;
        requestData.password2 = passwordConfirm;
      }
  
      const res = await api.post(route, requestData);
  
      if (!isRegistration) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        localStorage.setItem(ONBOARDING_COMPLETION, 'false');
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        // Check if the error is field-specific
        const errors = error.response.data;
    
        // Collect all field-specific error messages
        const errorMessages = Object.keys(errors)
          .map((field) => `${field}: ${errors[field].join(", ")}`)
          .join("\n");
    
        alert(`Error:\n${errorMessages}`);
      } else if (error.request) {
        alert("No response received from the server. Please try again.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);}
    };
  
  return (
    <form
        onSubmit={handleSubmit}
        className="w-full mx-auto border-solid border-2 backdrop-blur-3xl py-10 px-6 rounded-xl 
        max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
        noValidate
    >
        <h1 className="text-5xl font-bold text-center py-6">
        {isRegistration ? "Registration" : "Welcome!"}
        </h1>

        {/* Email Input Field */}
        <div className="flex flex-col py-2">
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-2 rounded-xl p-2 placeholder:italic placeholder:text-slate-800 outline-none border-gray-500 placeholder-gray-500"
            placeholder="Email"
        />
        </div>

        {/* Display Name Field for Registration */}
        {isRegistration && (
        <div className="flex flex-col py-2">
            <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="border-2 rounded-xl p-2 placeholder:italic placeholder:text-slate-800 outline-none border-gray-500 placeholder-gray-500"
            placeholder="Display Name"
            />
        </div>
        )}

        {/* Password Input Field */}
        <div className="flex flex-col py-2">
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-2 rounded-xl p-2 placeholder:italic placeholder:text-slate-800 outline-none border-gray-500 placeholder-gray-500"
            placeholder="Password"
        />
        </div>

        {/* Password Confirmation for Registration */}
        {isRegistration && (
        <div className="flex flex-col py-2">
            <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            className="border-2 rounded-xl p-2 placeholder:italic placeholder:text-slate-800 outline-none border-gray-500 placeholder-gray-500"
            placeholder="Confirm Password"
            />
        </div>
        )}

        {/* Submit Button */}
        <button
        type="submit"
        className="border-none rounded-2xl w-full my-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
        disabled={loading}
        >
        {loading ? "Loading..." : isRegistration ? "Register" : "Login"}
        </button>

        {/* Toggle Links */}
        <div>
        <p className="text-center">
            {isRegistration ? (
            <>
                Already have an account?{" "}
                <a className="font-bold hover:underline" href="/#/login">
                Login
                </a>
            </>
            ) : (
            <>
                Don't have an account?{" "}
                <a className="font-bold hover:underline" href="/#/register">
                Register
                </a>
            </>
            )}
        </p>
        </div>
    </form>
  );
}
