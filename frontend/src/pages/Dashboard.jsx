import NavBar from "../components/NavBar";
import Welcome from "../components/Welcome";
import ChartList from "./ChartList";
import Settings from "../components/Settings";
import UserProfile from "../components/UserProfile";
import Groups from "../components/Groups";
import AI from "../components/AI";
import { useState } from "react";

function Dashboard() {
  const [activePage, setActivePage] = useState("Welcome");

  const renderPage = () => {
    switch(activePage) {
        case "Welcome":
            return <Welcome />;
        case "Budget":
            return <ChartList/>;
        case "AI":
            return 
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