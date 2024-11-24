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
  const [currentTooltip, setCurrentTooltip] = useState(0); // State for current tooltip

  const handleNextTooltip = () => {
    if (currentTooltip < 6) {
      // Assuming 7 icons in total
      setCurrentTooltip(currentTooltip + 1);
    } else {
      // End onboarding
      setCurrentTooltip(-1); // Set to -1 if no tooltip should be visible
      localStorage.setItem(ONBOARDING_COMPLETION, "true");
    }
  };
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
          {/* Individual NavBarIcon components */}
          <NavBarIcon
            icon={<FaHouse size={iconSize} />}
            text="Home"
            onboardingText="Welcome to Home"
            onClick={() => setActivePage("Welcome")}
            isOnboarding={currentTooltip === 0}
            onNext={handleNextTooltip}
          />
          <NavBarIcon
            icon={<FaDollarSign size={iconSize} />}
            text="Budget"
            onboardingText="Manage your budgets"
            onClick={() => setActivePage("Budget")}
            isOnboarding={currentTooltip === 1}
            onNext={handleNextTooltip}
          />
          <NavBarIcon
            icon={<FaRegCalendarPlus size={iconSize} />}
            text="Calendar"
            onboardingText="Organize your schedule"
            onClick={() => setActivePage("Calendar")}
            isOnboarding={currentTooltip === 2}
            onNext={handleNextTooltip}
          />
          <NavBarIcon
            icon={<FaChartLine size={iconSize} />}
            text="Analytics"
            onboardingText="View analytics"
            onClick={() => setActivePage("AI")}
            isOnboarding={currentTooltip === 3}
            onNext={handleNextTooltip}
          />
          <NavBarIcon
            icon={<FaUserGroup size={iconSize} />}
            text="Groups"
            onboardingText="Collaborate in groups"
            onClick={() => setActivePage("Groups")}
            isOnboarding={currentTooltip === 4}
            onNext={handleNextTooltip}
          />
          <NavBarIcon
            icon={<FaUser size={iconSize} />}
            text="User Profile"
            onboardingText="Manage your profile"
            onClick={() => setActivePage("User")}
            isOnboarding={currentTooltip === 5}
            onNext={handleNextTooltip}
          />
          <NavBarIcon
            icon={<FaDoorOpen size={iconSize} />}
            text="Logout"
            onboardingText="Sign out of the application"
            onClick={handleLogout}
            isOnboarding={currentTooltip === 6}
            onNext={handleNextTooltip}
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

const NavBarIcon = ({ icon, text, onboardingText, onClick, isOnboarding, onNext }) => {
  return (
    <div className="nav-button group" onClick={onClick}>
      {icon}
      {isOnboarding && (
        <div className="tooltip scale-100 flex flex-row gap-2 justify-between items-center">
          <div>{onboardingText}</div>
          <button
            type="button"
            className="pointer-events-auto ml-auto bg-deep-sky-blue py-1 px-2 rounded-md"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering onClick of NavBarIcon
              onNext();
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
