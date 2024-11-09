import GroupAdd from "../components/GroupAdd";
import OwnedGroups from "../components/OwnedGroups";
import GroupMembership from "../components/GroupMembership";
import GroupModify from "../components/GroupModify";

function Groups(){
    const style = "bg-white p-8 rounded-xl shadow-lg";
    return (
      <div className="grid grid-cols-2 gap-8 size-full p-8 bg-custom-gradient animate-gradient">
        <div className="grid grid-rows-2 gap-8">
          <div className={`${style}`}>
            <OwnedGroups />
          </div>
          <div className={`${style}`}>
          <GroupMembership />
          </div>
        </div>
        <div className="grid grid-rows-2 gap-8">
          <div className={`${style}`}>
          <GroupAdd />
          </div>
          <div className={`${style}`}>
          <GroupModify />
          </div>
        </div>
      </div>
    );
  }

export default Groups;