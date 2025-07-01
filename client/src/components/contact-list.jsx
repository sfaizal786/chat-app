import { useAppStore } from "../store";
import { Avatar, AvatarImage } from "@/components/ui/Avatar.jsx";
import { HOST, GET_ALL_MESSAGE_ROUTE } from "@/utils/constant.js";
import { getColor } from "@/lib/utils.js";
import { apiClient } from "@/lib/api-client.js";

function ContactList({ contacts = [], isChannel = false }) {
  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatMessages,
    clearUnseenMessages,
    unseenMessages, // ✅ import unseenMessages
  } = useAppStore();

  const handleClick = async (contact) => {
    const newType = isChannel ? "channel" : "contact";

    if (selectedChatData?._id !== contact._id || selectedChatType !== newType) {
      setSelectedChatType(newType);
      setSelectedChatData(contact);
      setSelectedChatMessages([]);

      try {
        const res = await apiClient.post(
          GET_ALL_MESSAGE_ROUTE,
          { id: contact._id },
          { withCredentials: true }
        );

        if (res.status === 200) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (error) {
        console.error("❌ Failed to load messages:", error);
      }

      clearUnseenMessages(contact._id);
    }
  };

  return (
    <div className="mt-5 ml-5">
      {contacts.map((contact) => {
        const unseenCount = unseenMessages[contact._id] || 0;

        return (
          <div
            key={contact._id}
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer relative ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                : "hover:bg-[#f1f1f111]"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-5 text-neutral-300 items-center">
              {!isChannel && (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="profile"
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`
                        ${
                          selectedChatData &&
                          selectedChatData._id === contact._id
                            ? "bg-[#ffffff22] border border-white/50"
                            : getColor(contact.color)
                        }
                        uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full
                      `}
                    >
                      {contact.firstName
                        ? contact.firstName.charAt(0)
                        : contact.empid?.charAt(0) || "?"}
                    </div>
                  )}
                </Avatar>
              )}

              {isChannel && (
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                  #
                </div>
              )}

              <span className="text-white">
                {isChannel
                  ? contact.name
                  : contact.firstName
                  ? `${contact.firstName} ${contact.lastName}`
                  : contact.empid}
              </span>
            </div>

            {unseenCount > 0 && (
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                {unseenCount}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ContactList;
