import { FaHouse, FaGear, FaUser, FaUserGroup, FaRegCalendarPlus, FaChartLine, FaDollarSign } from "react-icons/fa6";

function NavBar({setActivePage}){
    const iconSize = "36";

    return(
        <div className="top-0 left-0 h-screen w-24 flex flex-col bg-dodger-blue">
            <NavBarIcon icon={<FaHouse size={iconSize} />} text="Home" onClick={() => setActivePage("Welcome")}/>
            <NavBarIcon icon={<FaDollarSign size={iconSize} />} text="Budget" onClick={() => setActivePage("Budget")}/>
            <NavBarIcon icon={<FaRegCalendarPlus size={iconSize}/>} text="Calendar" onClick={()=>setActivePage("Calendar")}/>
            <NavBarIcon icon={<FaChartLine size={iconSize}/>} text="Analytics" onClick={()=>setActivePage("AI")}/>
            <NavBarIcon icon={<FaUserGroup size={iconSize} />} text="Groups" onClick={() => setActivePage("Groups")}/>
            <NavBarIcon icon={<FaUser size={iconSize} />} text="Profile" onClick={() => setActivePage("User")}/>
            <NavBarIcon icon={<FaGear size={iconSize} />} text="Settings" onClick={() => setActivePage("Settings")}/>
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