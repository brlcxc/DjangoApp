import {
  FaHouse,
  FaUser,
  FaUserGroup,
  FaRegCalendarPlus,
  FaChartLine,
  FaDollarSign,
  FaDoorOpen,
  FaBars,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ONBOARDING_COMPLETION } from "../constants";

function NavBar({ setActivePage }) {
  const [isOpen, setIsOpen] = useState(false); // State to track nav visibility
  const iconSize = "36";
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleOnboarding = () => {
    const onboardingCompleted = localStorage.getItem(ONBOARDING_COMPLETION);
    if (true) {
      toggleModal;
    }
  };

  // maybe slight pause before modal is active and then fade to it

  const completeOnboarding = () => {
    localStorage.setItem(ON_BOARDING_COMPLETION, "true");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/logout");
  };

  return (
    <div className="">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-screen w-24 bg-dodger-blue flex flex-col transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 z-50`}
        >
          <NavBarIcon
            icon={<FaHouse size={iconSize} />}
            text="Home"
            onboardingText="Home"
            onClick={() => setActivePage("Welcome")}
          />
          <NavBarIcon
            icon={<FaDollarSign size={iconSize} />}
            text="Budget"
            onboardingText="Home"
            onClick={() => setActivePage("Budget")}
          />
          <NavBarIcon
            icon={<FaRegCalendarPlus size={iconSize} />}
            text="Calendar"
            onboardingText="Home"
            onClick={() => setActivePage("Calendar")}
          />
          <NavBarIcon
            icon={<FaChartLine size={iconSize} />}
            text="Analytics"
            onboardingText="Home"
            onClick={() => setActivePage("AI")}
          />
          <NavBarIcon
            icon={<FaUserGroup size={iconSize} />}
            text="Groups"
            onboardingText="Home"
            onClick={() => setActivePage("Groups")}
          />
          <NavBarIcon
            icon={<FaUser size={iconSize} />}
            text="User Profile"
            onboardingText="User Profile: location for changing user information and changing application settings"
            onClick={() => setActivePage("User")}
          />
          {/*
          <NavBarIcon
            icon={<FaGear size={iconSize} />}
            text="Settings"
            onboardingText="Home"
            onClick={() => setActivePage("Settings")}
          />*/}
          <NavBarIcon
            icon={<FaDoorOpen size={iconSize} />}
            text="Logout"
            onboardingText="Logout: for signing out of the application"
            onClick={handleLogout}
          />
        </div>
        {/* logout: for signing out of the application */}
        {/* Page Content */}
        <div className="flex-1 ml-0 md:ml-24">
          {/* Page content goes here */}
        </div>

        {/* Toggle Button - Visible only on mobile */}
        <button
          className="text-white p-3 fixed bottom-3 right-5 z-50 md:hidden bg-lavender rounded-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars size={iconSize} />
        </button>
      </div>
      {/* {true && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-40 z-40 fade-in"></div>
      )} */}
    </div>
  );
}

const NavBarIcon = ({ icon, text, onboardingText, onClick }) => {
  return (
    <div className="nav-button group" onClick={onClick}>
      {icon}
      {false ? (
        <span className="tooltip group-hover:scale-100">{text}</span>
      ) : (
        <div className="tooltip scale-100 flex flex-row gap-2 justify-between items-center">
          <div>{onboardingText}</div>
          <button
            type="button"
            className="ml-auto bg-deep-sky-blue py-1 px-2 rounded-md"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
