import { FaHouse, FaGear, FaUser, FaUserGroup, FaRegCalendarPlus, FaChartLine, FaDollarSign, FaDoorOpen, FaBars } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
  
function NavBar({ setActivePage }) {
  const [isOpen, setIsOpen] = useState(false); // State to track nav visibility
  const iconSize = "36";
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/logout");
  };
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-24 bg-dodger-blue flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-50`}
      >
        <NavBarIcon icon={<FaHouse size={iconSize} />} text="Home" onClick={() => setActivePage("Welcome")}/>
        <NavBarIcon icon={<FaDollarSign size={iconSize} />} text="Budget" onClick={() => setActivePage("Budget")}/>
        <NavBarIcon icon={<FaRegCalendarPlus size={iconSize}/>} text="Calendar" onClick={()=>setActivePage("Calendar")}/>
        <NavBarIcon icon={<FaChartLine size={iconSize}/>} text="Analytics" onClick={()=>setActivePage("AI")}/>
        <NavBarIcon icon={<FaUserGroup size={iconSize} />} text="Groups" onClick={() => setActivePage("Groups")}/>
        <NavBarIcon icon={<FaUser size={iconSize} />} text="Profile" onClick={() => setActivePage("User")}/>
        <NavBarIcon icon={<FaGear size={iconSize} />} text="Settings" onClick={() => setActivePage("Settings")}/>
        <NavBarIcon icon={<FaDoorOpen size={iconSize} />} text="Logout" onClick={handleLogout}/>
      </div>
      
      {/* Page Content */}
      <div className="flex-1 ml-0 md:ml-24">
        {/* Page content goes here */}
      </div>
      
      {/* Toggle Button - Visible only on mobile */}
      <button
        className="text-white p-3 fixed bottom-3 left-5 z-50 md:hidden bg-lavender rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars size={iconSize} />
      </button>
    </div>
  );
}

const NavBarIcon = ({icon, text, onClick}) => {
  return(
    <div className="nav-button group" onClick={onClick}>
      {icon}
      <span className="tooltip group-hover:scale-100">
        {text}
      </span>
    </div>
  );
};

export default NavBar;
