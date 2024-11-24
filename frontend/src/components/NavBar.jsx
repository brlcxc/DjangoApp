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

//The hover does not return after the onboarding text is done
//modal fade starts black then refades
function NavBar({ setActivePage }) {
  const [isOpen, setIsOpen] = useState(false); // State to track nav visibility
  const iconSize = "36";
  const navigate = useNavigate();
  const [currentTooltip, setCurrentTooltip] = useState(0); // State for current tooltip

  const onboardingCompletion = localStorage.getItem(ONBOARDING_COMPLETION);
  const [isModalOpen, setIsModalOpen] = useState(
    onboardingCompletion === "false"
  );

  console.log(onboardingCompletion);
  const handleNextTooltip = () => {
    if (currentTooltip < 6 && isModalOpen) {
      // Assuming 7 icons in total
      setCurrentTooltip(currentTooltip + 1);
    } else {
      // End onboarding
      setCurrentTooltip(-1); // Set to -1 if no tooltip should be visible
      localStorage.setItem(ONBOARDING_COMPLETION, "true");
      toggleModal;
    }
  };
  const toggleModal = () => setIsModalOpen(!isModalOpen);

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
            onboardingText="Welcome page"
            onClick={() => setActivePage("Welcome")}
            isOnboarding={currentTooltip === 0}
            onNext={handleNextTooltip}
            isModalOpen={isModalOpen}
          />
          <NavBarIcon
            icon={<FaDollarSign size={iconSize} />}
            text="Budget"
            onboardingText="Budget: adding and removing transactions in groups with graphical representations"
            onClick={() => setActivePage("Budget")}
            isOnboarding={currentTooltip === 1}
            onNext={handleNextTooltip}
            isModalOpen={isModalOpen}
          />
          <NavBarIcon
            icon={<FaRegCalendarPlus size={iconSize} />}
            text="Calendar"
            onboardingText="Calendar: chronology transaction representation"
            onClick={() => setActivePage("Calendar")}
            isOnboarding={currentTooltip === 2}
            onNext={handleNextTooltip}
            isModalOpen={isModalOpen}
          />
          <NavBarIcon
            icon={<FaChartLine size={iconSize} />}
            text="Analytics"
            onboardingText="AI Analytics: provides proactive, situational, budgeting suggestions"
            onClick={() => setActivePage("AI Analytics")}
            isOnboarding={currentTooltip === 3}
            onNext={handleNextTooltip}
            isModalOpen={isModalOpen}
          />
          <NavBarIcon
            icon={<FaUserGroup size={iconSize} />}
            text="Groups"
            onboardingText="Groups: modifying and creating groups"
            onClick={() => setActivePage("Groups")}
            isOnboarding={currentTooltip === 4}
            onNext={handleNextTooltip}
            isModalOpen={isModalOpen}
          />
          <NavBarIcon
            icon={<FaUser size={iconSize} />}
            text="User Profile"
            onboardingText="User Profile: location for changing user information and application settings"
            onClick={() => setActivePage("User")}
            isOnboarding={currentTooltip === 5}
            onNext={handleNextTooltip}
            isModalOpen={isModalOpen}
          />
          <NavBarIcon
            icon={<FaDoorOpen size={iconSize} />}
            text="Logout"
            onboardingText="Sign out of the application"
            onClick={handleLogout}
            isOnboarding={currentTooltip === 6}
            onNext={handleNextTooltip}
            isModalOpen={isModalOpen}
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
      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-40 z-40 fade-in"></div>
      )} */}
    </div>
  );
}

const NavBarIcon = ({
  icon,
  text,
  onboardingText,
  onClick,
  isOnboarding,
  onNext,
  isModalOpen,
}) => {
  return (
    <div className="nav-button group" onClick={onClick}>
      {icon}
      {!isModalOpen ? (
        <span className="tooltip group-hover:scale-100">{text}</span>
      ) : (
        isOnboarding && (
          <div className="tooltip scale-100 justify-between items-center">
            <div className="w-64">{onboardingText}</div>
            <button
              type="button"
              className="float-end pointer-events-auto ml-auto bg-deep-sky-blue py-1 px-2 rounded-md"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering onClick of NavBarIcon
                onNext();
              }}
            >
              Next
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default NavBar;
