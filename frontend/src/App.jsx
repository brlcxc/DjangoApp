import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import TransactionList from "./pages/TransactionList";
import Charts from "./pages/Charts";

// ChartJS.register(ArcElement, Tooltip, Legend);

function Logout(){
  localStorage.clear();
  return <Navigate to="/login"/>;
}

function RegisterAndLogout(){
  localStorage.clear();
  return <Register />;
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }
        />
        <Route path="/list" element={<TransactionList/>}/>
        <Route path="/charts" element={<Charts/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/logout" element={<Logout/>}/>
        <Route path="/register" element={<RegisterAndLogout/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
