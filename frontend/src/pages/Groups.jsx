import GroupAdd from "../components/GroupAdd";
import OwnedGroups from "../components/OwnedGroups";
import GroupMembership from "../components/GroupMembership";
import GroupModify from "../components/GroupModify";
import { GroupModifyProvider } from "../context/GroupModifyContext";

function Groups() {
  const style = "bg-white p-8 rounded-xl shadow-lg";

  return (
    <GroupModifyProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-custom-gradient min-h-screen">
        <div className="flex flex-col gap-8">
          <div className={`${style} h-[70%] md:h-[70%]`}>
            <GroupModify />
          </div>
          <div className={`${style} h-[26%] md:h-[26%]`}>
            <OwnedGroups />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className={`${style} h-[70%] md:h-[70%]`}>
            <GroupAdd />
          </div>
          <div className={`${style} h-[26%] md:h-[26%]`}>
            <GroupMembership />
          </div>
        </div>
      </div>
    </GroupModifyProvider>
  );
}

export default Groups;
