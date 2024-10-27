import { FaHouse, FaGear, FaUser, FaUserGroup, FaRegCalendar  } from "react-icons/fa6";

function NavBar(){
    return(
        <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-dodger-blue">
            <NavBarIcon icon={<FaHouse size="28"/>}/>
            <NavBarIcon icon={<FaRegCalendar size="28"/>}/>
            <NavBarIcon icon={<FaUserGroup size="28"/>}/>
            <NavBarIcon icon={<FaUser size="28"/>}/>
            <NavBarIcon icon={<FaGear size="28"/>}/>
        </div>
    )
}

const NavBarIcon = ({icon}) => {
    <div className="nav-button">
        {icon}
    </div>
}

export default NavBar;