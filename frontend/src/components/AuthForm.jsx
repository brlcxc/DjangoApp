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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
  
    try {
      const requestData = { email, password };
  
      if (isRegistration) {
        if (password !== passwordConfirm) {
          setErrors({passwordConfirm: "Passwords do not match"});
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
        navigate("/dash");
      } else {
        localStorage.setItem(ONBOARDING_COMPLETION, 'false');
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        console.error("API Response Error:", error.response.data);
        const apiErrors = error.response.data;
        const newErrors = {};

        for (const [field, messages] of Object.entries(apiErrors)) {
          if (field === "non_field_errors") {
            newErrors.general = messages.join(", ");
          } else if (field === "detail"){
            newErrors.general = messages;
          } else if (Array.isArray(messages)) {
            newErrors[field] = messages.join(", ");
          } else{
            newErrors[field] = messages;
          }
        }

        setErrors(newErrors);
      } else if (error.request) {
        setErrors({ general: "No response received from the server. Please try again." });
      } else {
        setErrors({ general: `Error: ${error.message}` });
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
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
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
            {errors.display_name && <p className="text-red-600 text-sm mt-1">{errors.display_name}</p>}
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
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
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
            {errors.passwordConfirm && <p className="text-red-600 text-sm mt-1">{errors.passwordConfirm}</p>}
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

        {errors.general && <p className="text-red-600 text-sm text-center">{errors.general}</p>}

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
