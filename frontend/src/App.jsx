import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import NotFound from "./routes/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./routes/Dashboard";
import Loading3D from "./components/Loading3D";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <Loading3D />
  );
}

export default App;
