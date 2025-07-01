import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAppStore } from "../store";
import { HOST } from "../utils/constant";
import { io } from "socket.io-client";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userInfo } = useAppStore();

  const selectedChatDataRef = useRef(null);
  const selectedChatTypeRef = useRef(null);

  const selectedChatData = useAppStore((s) => s.selectedChatData);
  const selectedChatType = useAppStore((s) => s.selectedChatType);

  useEffect(() => {
    selectedChatDataRef.current = selectedChatData;
    selectedChatTypeRef.current = selectedChatType;
  }, [selectedChatData, selectedChatType]);

  useEffect(() => {
    if (!userInfo?.id) return;

    const newSocket = io(HOST, {
      withCredentials: true,
      query: { userId: userInfo.id },
    });

    newSocket.on("connect", () => {
    });

    newSocket.onAny((event, ...args) => {
    
    });

    const {
      addMessage,
      addContactInDMContacts,
      addChannel,
      moveChannelToTop,
      setUserInfo,
      addUnseenMessage,
      addChannelInChannelList,
    } = useAppStore.getState();

    const handleReceiveMessage = (message) => {
      const selectedChatData = selectedChatDataRef.current;
      const selectedChatType = selectedChatTypeRef.current;

      if (
        selectedChatType === "contact" &&
        (
          selectedChatData?._id === message.sender._id ||
          selectedChatData?._id === message.recipient._id
        )
      ) {
        addMessage(message);
      } else {
        addUnseenMessage(message);
      }

      addContactInDMContacts(message);
    };

    const handleReceiveChannelMessage = (message) => {
      const selectedChatData = selectedChatDataRef.current;
      const selectedChatType = selectedChatTypeRef.current;

      if (
        selectedChatType === "channel" &&
        selectedChatData?._id === message.channelId
      ) {
        addMessage(message);
        addChannelInChannelList(message)
      } else {
              // ✅ Track unseen for channel
        addUnseenMessage({
          sender: { _id: message.channelId },
        });
      }

      moveChannelToTop?.(message);
    };

    const handleNewChannel = (channel) => {
      addChannel(channel);
    };

    const handleProfileUpdate = (newUserInfo) => {
      setUserInfo(newUserInfo);
    };

    newSocket.on("recieveMessage", handleReceiveMessage);
    newSocket.on("recieve-channel-message", handleReceiveChannelMessage);
    newSocket.on("newChannelCreated", handleNewChannel);
    newSocket.on("profile-updated", handleProfileUpdate);

    setSocket(newSocket);

    return () => {
      newSocket.off("recieveMessage", handleReceiveMessage);
      newSocket.off("recieve-channel-message", handleReceiveChannelMessage);
      newSocket.off("newChannelCreated", handleNewChannel);
      newSocket.off("profile-updated", handleProfileUpdate);
      newSocket.offAny();
      newSocket.disconnect();
    };
  }, [userInfo?.id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
