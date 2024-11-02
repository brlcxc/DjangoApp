import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import NotFound from "./routes/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./routes/Dashboard";
import { TransactionProvider } from "./context/TransactionContext";
import { GroupProvider, GroupContext } from "./context/GroupContext";
import { SelectedGroupProvider, useSelectedGroup } from './context/SelectedGroupContext';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

// Wrapper component to access selectedGroupUUIDs and groupUUIDs
function AppContent() {
  const { selectedGroupUUIDs } = useSelectedGroup();
  // const { groupUUIDs } = useContext(GroupContext); // Access groupUUIDs here

  // console.log("Selected Group UUIDs:", selectedGroupUUIDs);
  // console.log("All Group UUIDs:", groupUUIDs); // Log all group UUIDs

  return (
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TransactionProvider groupUUIDs={selectedGroupUUIDs}>
                <Dashboard />
              </TransactionProvider>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
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
