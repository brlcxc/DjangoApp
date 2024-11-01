import NavBar from "../components/NavBar";
import Welcome from "../pages/Welcome";
import Budget from "../pages/Budget";
import Settings from "../pages/Settings";
import UserProfile from "../pages/UserProfile";
import Groups from "../pages/Groups";
import AI from "../pages/AI";
import Calendar from "../pages/Calendar";
import { useState } from "react";

function Dashboard() {
  const [activePage, setActivePage] = useState("Welcome");

  const renderPage = () => {
    switch(activePage) {
        case "Welcome":
            return <Welcome />;
        case "Budget":
            return <Budget/>;
        case "Calendar":
            return <Calendar/>;
        case "AI":
            return <AI/>;
        case "Groups":
            return <Groups/>;
        case "User":
            return <UserProfile/>;
        case "Settings":
            return <Settings/>;
        default:
            return <Welcome/>;
    }
  };


  return(
      <div className="flex h-screen">
          <NavBar setActivePage={setActivePage}/>
          <div className="flex-1 overflow-y-auto">
            {renderPage()}
          </div>
      </div>
  )
}

export default Dashboard;