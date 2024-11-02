import NavBar from "../components/NavBar";
import Welcome from "../pages/Welcome";
import Budget from "../pages/Budget";
import Settings from "../pages/Settings";
import UserProfile from "../pages/UserProfile";
import Groups from "../pages/Groups";
import AI from "../pages/AI";
import Calendar from "../pages/Calendar";
import { useState } from "react";
import { TransactionProvider } from "../context/TransactionContext";
import { GroupProvider } from "../context/GroupContext";
import { SelectedGroupProvider, useSelectedGroup } from '../context/SelectedGroupContext';

function Dashboard() {
  const [activePage, setActivePage] = useState("Welcome");

  const renderPage = () => {
    switch(activePage) {
      case "Welcome":
        return <Welcome />;
      case "Budget":
        return <Budget />;
      case "Calendar":
        return <Calendar />;
      case "AI":
        return <AI />;
      case "Groups":
        return <Groups />;
      case "User":
        return <UserProfile />;
      case "Settings":
        return <Settings />;
      default:
        return <Welcome />;
    }
  };

  function PageContent() {

    const style = "bg-white p-8 mb-8 rounded-xl shadow-lg mb-8";
    const { selectedGroupUUIDs } = useSelectedGroup(); // Now safe to use
    return (
      <TransactionProvider groupUUIDs={selectedGroupUUIDs}>
          <div className="flex h-screen">
            <NavBar setActivePage={setActivePage} />
            <div className="flex-1 overflow-y-auto">
              {renderPage()}
            </div>
          </div>
      </TransactionProvider>
    );
  }

  return (
    <GroupProvider>
      <SelectedGroupProvider>
        <PageContent />
      </SelectedGroupProvider>
    </GroupProvider>
  );
}

export default Dashboard;



// function BudgetContent() {

//     const style = "bg-white p-8 mb-8 rounded-xl shadow-lg mb-8";
//     const { selectedGroupUUIDs } = useSelectedGroup(); // Now safe to use
//     return (
//       <TransactionProvider groupUUIDs={selectedGroupUUIDs}>
//         <div className="grid grid-cols-2 gap-8 size-full p-8 bg-custom-gradient animate-gradient">
//           <div>
//             <div className={`${style} h-[70%]`}>
//               <TransactionList />
//             </div>
//             <div className={`${style} h-[25%]`}>
//               <TransactionAdd />
//             </div>
//           </div>
//           <div>
//             <div className={`${style} h-[70%]`}>
//               <Charts />
//             </div>
//             <div className={`${style} h-[25%]`}>
//               <Toggle />
//             </div>
//           </div>
//         </div>
//       </TransactionProvider>
//     );
//   }
  
//   function Budget() {
//     return (
//       <GroupProvider>
//         <SelectedGroupProvider>
//           <BudgetContent />
//         </SelectedGroupProvider>
//       </GroupProvider>
//     );
//   }
  
//   export default Budget;