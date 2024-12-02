import NavBar from "../components/NavBar";
import Welcome from "../pages/Welcome";
import Budget from "../pages/Budget";
import Settings from "../pages/Settings";
import UserProfile from "../pages/UserProfile";
import Groups from "../pages/Groups";
import AI from "../pages/AI";
import Calendar from "../pages/Calendar";
import { useEffect, useState } from "react";
import { TransactionProvider } from "../context/TransactionContext";
import { GroupProvider } from "../context/GroupContext";
import { SelectedGroupProvider, useSelectedGroup } from '../context/SelectedGroupContext';
import { ACCESS_TOKEN } from "../constants";
import api from "../api";

// TODO: for both chart and list deselecting all groups and then returning to the page will keep them in a loading state rather than displaying that there is no data

function Dashboard() {
  const [activePage, setActivePage] = useState("Welcome");

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);

        const response = await api.get('api/users/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.setItem('DISPLAY_NAME', response.data.display_name); // Store user display name in local storage
        localStorage.setItem('USER_ID', response.data.id); // Store user ID in local storage
        localStorage.setItem('USER_EMAIL', response.data.email);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const renderPage = () => {
    switch(activePage) {
      case "Welcome":
        return <Welcome />;
      case "Budget":
        return <Budget />;
      case "Calendar":
        return <Calendar />;
      case "AI":
        return <AI />;
      case "Groups":
        return <Groups />;
      case "User":
        return <UserProfile />;
      case "Settings":
        return <Settings />;
      default:
        return <Welcome />;
    }
  };

  function PageContent() {
    const { selectedGroupUUIDs } = useSelectedGroup(); // Now safe to use
    return (
      <TransactionProvider groupUUIDs={selectedGroupUUIDs}>
          <div className="flex h-screen">
            <NavBar setActivePage={setActivePage} />
            <div className="flex-1 overflow-y-auto">
              {renderPage()}
            </div>
          </div>
      </TransactionProvider>
    );
  }

  return (
    <GroupProvider>
      <SelectedGroupProvider>
        <PageContent />
      </SelectedGroupProvider>
    </GroupProvider>
  );
}

export default Dashboard;