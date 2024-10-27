import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post("/api/token/", { email, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/");
      window.location.reload();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
        onSubmit={handleSubmit}
        className="w-full mx-auto border-solid border-2 backdrop-blur-3xl py-10 px-6 rounded-xl 
        max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
        noValidate
    >
        {/* Welcome Header */}
        <h1 className="text-5xl font-bold text-center py-6">Welcome!</h1>

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

        {/* Additional Options */}
        <div className="flex justify-between p-1">
        <p className="flex items-center">
            <input className="mr-2" type="checkbox" /> Remember Me
        </p>
        <a className="hover:underline" href="#">
            Forgot password?
        </a>
        </div>

        {/* Submit Button */}
        <button
        type="submit"
        className="border-none rounded-2xl w-full my-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
        disabled={loading}
        >
        {loading ? "Loading..." : "Login"}
        </button>

        {/* Register link */}
        <div>
        <p className="text-center">
            Don't have an account?{" "}
            <a className="font-bold hover:underline" href="#">
            Register
            </a>
        </p>
        </div>
    </form>
  );
}
