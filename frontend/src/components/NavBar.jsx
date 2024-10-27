import { FaHouse, FaGear, FaUser, FaUserGroup, FaRegCalendar  } from "react-icons/fa6";

function NavBar(){
    const iconSize = "36";

    return(
        <div className="top-0 left-0 h-screen w-24 flex flex-col bg-dodger-blue">
            <NavBarIcon icon={<FaHouse size={iconSize}/>} text="Home"/>
            <NavBarIcon icon={<FaRegCalendar size={iconSize}/>} text="Budget"/>
            <NavBarIcon icon={<FaUserGroup size={iconSize}/>} text="Groups"/>
            <NavBarIcon icon={<FaUser size={iconSize}/>} text="Profile"/>
            <NavBarIcon icon={<FaGear size={iconSize}/>} text="Settings"/>
        </div>
    )
}

const NavBarIcon = ({icon, text}) => {
    return(
        <div className="nav-button group">
            {icon}
            <span className="tooltip group-hover:scale-100">
                {text}
            </span>
        </div>
    )
}

export default NavBar;