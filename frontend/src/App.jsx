import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import TransactionList from "./pages/TransactionList";
import Charts from "./pages/Charts";
import TransactionAdd from "./pages/TransactionAdd";
import ChartList from "./pages/ChartList";


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
        <Route path="/all" element={<ChartList/>}/>
        <Route path="/add" element={<TransactionAdd/>}/>
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
