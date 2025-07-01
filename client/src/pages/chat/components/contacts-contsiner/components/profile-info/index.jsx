import { Avatar, AvatarImage } from "@/components/ui/Avatar.jsx";
import { useAppStore } from "../../../../../../store";
import { HOST, LOGOUT_ROUTE } from "../../../../../../utils/constant.js";
import { getColor } from "@/lib/utils.js";
import { FiEdit2 } from "react-icons/fi";
import { apiClient } from "@/lib/api-client.js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";

function ProfileInfo() {
  const navigate = useNavigate();

  // ✅ Zustand selectors — ensures reactive updates
  const userInfo = useAppStore((s) => s.userInfo);
  const setUserInfo = useAppStore((s) => s.setUserInfo);

  const logOut = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserInfo(null);
        navigate("/auth");
      }
    } catch (error) {
       console.log(error);
    }
  };

  // ✅ Guard for undefined userInfo
  if (!userInfo) return null;

  return (
    <div className="absolute bottom-0 h-20 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0)
                  : userInfo.empid?.charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
        <div className="flex justify-center items-center">
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName} (${userInfo.empid})`
            : ""}
        </div>
      </div>

      <div className="flex gap-5">
        <Tooltip>
          <TooltipTrigger>
            <FiEdit2
              className="text-purple-500 text-xl font-medium cursor-pointer"
              onClick={() => navigate("/profile")}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white">
            Edit Profile
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <IoPowerSharp
              className="text-red-500 text-xl font-medium cursor-pointer"
              onClick={logOut}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white">
            Log out
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default ProfileInfo;
