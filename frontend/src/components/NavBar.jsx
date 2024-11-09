import { FaHouse, FaGear, FaUser, FaUserGroup, FaRegCalendarPlus, FaChartLine, FaDollarSign, FaDoorOpen } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function NavBar({setActivePage}){
    const iconSize = "36";
    const navigate = useNavigate();

    //Note: I am unsure if there is maybe a better way to link back to the logout route
    const handleLogout = () => {
      localStorage.clear(); // Clear any stored data
      navigate("/logout");  // Redirect to the logout route
    };

    return(
        <div className="top-0 left-0 h-screen w-24 flex flex-col bg-dodger-blue">
            <NavBarIcon icon={<FaHouse size={iconSize} />} text="Home" onClick={() => setActivePage("Welcome")}/>
            <NavBarIcon icon={<FaDollarSign size={iconSize} />} text="Budget" onClick={() => setActivePage("Budget")}/>
            <NavBarIcon icon={<FaRegCalendarPlus size={iconSize}/>} text="Calendar" onClick={()=>setActivePage("Calendar")}/>
            <NavBarIcon icon={<FaChartLine size={iconSize}/>} text="Analytics" onClick={()=>setActivePage("AI")}/>
            <NavBarIcon icon={<FaUserGroup size={iconSize} />} text="Groups" onClick={() => setActivePage("Groups")}/>
            <NavBarIcon icon={<FaUser size={iconSize} />} text="Profile" onClick={() => setActivePage("User")}/>
            <NavBarIcon icon={<FaGear size={iconSize} />} text="Settings" onClick={() => setActivePage("Settings")}/>
            <NavBarIcon icon={<FaDoorOpen size={iconSize} />} text="Logout" onClick={handleLogout}/>
        </div>
    )
}

const NavBarIcon = ({icon, text, onClick}) => {
    return(
        <div className="nav-button group" onClick={onClick}>
            {icon}
            <span className="tooltip group-hover:scale-100">
                {text}
            </span>
        </div>
    )
}

export default NavBar;