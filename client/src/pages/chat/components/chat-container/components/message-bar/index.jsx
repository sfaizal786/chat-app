import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "../../../../../../store";
import { useSocket } from "../../../../../../context/SocketContext";
import { apiClient } from "@/lib/api-client.js";
import { UPLOAD_FILE_ROUTE } from "../../../../../../utils/constant";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();

  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setFileUploadProgress,
    setIsUploading,
  } = useAppStore();

  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const socket = useSocket();

  // Close emoji picker on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const payload = {
      sender: userInfo.id,
      content: message,
      messageType: "text",
      fileUrl: undefined,
    };

    if (selectedChatType === "contact") {
      payload.recipient = selectedChatData._id;
      socket.emit("sendMessage", payload);
    } else if (selectedChatType === "channel") {
      payload.channelId = selectedChatData._id;
      socket.emit("send-channel-message", payload);
    }

    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("files", file);

      setIsUploading(true);
      const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
        withCredentials: true,
        onUploadProgress: (data) => {
          setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
        },
      });

      setIsUploading(false);
      setFileUploadProgress(0); // Reset progress after upload

      if (response.status === 200 && response.data?.filePath) {
        const filePayload = {
          sender: userInfo.id,
          messageType: "file",
          fileUrl: response.data.filePath,
        };

        if (selectedChatType === "contact") {
          filePayload.recipient = selectedChatData._id;
          socket.emit("sendMessage", filePayload);
        } else if (selectedChatType === "channel") {
          filePayload.channelId = selectedChatData._id;
          socket.emit("send-channel-message", filePayload);
        }
      }
    } catch (error) {
      console.error("File upload error:", error);
      setIsUploading(false);
      setFileUploadProgress(0);
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:outline-none w-full text-white"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Attach file */}
        <button
          className="text-neutral-500 hover:text-white transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />

        {/* Emoji picker */}
        <div className="relative">
          <button
            className="text-neutral-500 hover:text-white transition-all"
            onClick={() => setEmojiPickerOpen((prev) => !prev)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          {emojiPickerOpen && (
            <div className="absolute bottom-16 right-0 z-50" ref={emojiRef}>
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Send message */}
      <button
        onClick={handleSendMessage}
        className="bg-[#8417ff] rounded-md p-5 hover:bg-[#741bda] transition-all"
      >
        <IoSend className="text-2xl text-white" />
      </button>
    </div>
  );
};

export default MessageBar;
