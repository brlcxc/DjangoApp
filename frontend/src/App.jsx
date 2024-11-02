import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import NotFound from "./routes/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./routes/Dashboard";
import { TransactionProvider } from "./context/TransactionContext";
import { GroupProvider } from "./context/GroupContext";
import { SelectedGroupProvider, useSelectedGroup } from './context/SelectedGroupContext';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

// Wrapper component to access selectedGroupUUIDs
function AppContent() {
  const { selectedGroupUUIDs } = useSelectedGroup();

  return (
    <TransactionProvider groupUUIDs={selectedGroupUUIDs}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TransactionProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <GroupProvider>
        <SelectedGroupProvider>
          <AppContent /> {/* Use the wrapper component here */}
        </SelectedGroupProvider>
      </GroupProvider>
    </BrowserRouter>
  );
}

export default App;
