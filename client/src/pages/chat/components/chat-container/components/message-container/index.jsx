import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../../../../../store";
import moment from "moment";
import { apiClient } from "@/lib/api-client.js";
import { GET_ALL_MESSAGE_ROUTE, GET_CHANNEL_MESSAGE, HOST } from "../../../../../../utils/constant.js";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar.jsx";
import { getColor } from "@/lib/utils.js";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();

  const [showImage,setshowImage] = useState(false);
  const [imageUrl,setimageUrl] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGE_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error({ error });
      }
    };

     const getChannelMessages = async () => {
         try {
           // FIXED: Pass config as the 2nd argument only
           const response = await apiClient.get(
             `${GET_CHANNEL_MESSAGE}/${selectedChatData._id}`,
             { withCredentials: true }
           );
           if (response.data.messages) {
             setSelectedChatMessages(response.data.messages);
           }
         } catch (error) {
           console.error({ error });
         }
       };
   

    if (selectedChatData._id && selectedChatType === "contact") {
      getMessages();
    } else if (selectedChatData._id && selectedChatType === "channel") {
      getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [selectedChatMessages]);

  const checkImage = (filePath) =>
    /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i.test(filePath);

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    try {
      const response = await apiClient.get(`${HOST}${url}`, {
        responseType: "blob",
        onDownloadProgress: (e) => {
          const percentComplete = Math.round((e.loaded * 100) / e.total);
          setFileDownloadProgress(percentComplete);
        },
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  const renderFileMessage = (message) => {
    const isImage = checkImage(message.fileUrl);
    const isUser = message.sender._id === userInfo.id;
    return (
      <div
        className={`${
              
          isUser
             ?"bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-br-lg rounded-tl-lg"
        : "bg-[#2a2b33]/5 text-white /80 border--[#ffffff]/20 rounded-br-lg rounded-tl-lg"}
         border inline-block p-4 rounded my-1 max-w-[505px] break-words`}
        
      >
        {isImage ? (
          <div
            className="cursor-pointer"
            onClick={() => {
             setshowImage(true);
             setimageUrl(message.fileUrl);
            }}
          >
            <img
              src={`${HOST}${message.fileUrl}`}
              height={300}
              width={300}
              alt="shared"
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
              <MdFolderZip />
            </span>
            <span>{message.fileUrl.split("/").pop()}</span>
            <span
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(message.fileUrl)}
            >
              <IoMdArrowRoundDown />
            </span>
          </div>
        )}
      </div>
    );
  };

 const renderDMMessages = (message) => {
   const isMine = message.sender === selectedChatData._id;


  return (
    <div className={`${isMine ? "text-left" : "text-right"}`}>
      {message.messageType === "text" && (
        <div
          className={`${
            !isMine
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-br-lg rounded-tl-lg"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 rounded-br-lg rounded-tl-lg"
          } border inline-block p-4 rounded my-1 max-w-[505px] break-words`}
        >
          {message.content}
        </div>
      )}

      {message.messageType === "file" && (
        <div
          className={`${
            !isMine
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-br-lg rounded-tl-lg"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 rounded-br-lg rounded-tl-lg"
          } border inline-block p-4 rounded my-1 max-w-[505px] break-words`}
        >
          {checkImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setshowImage(true);
                setimageUrl(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}${message.fileUrl}`}
                height={300}
                width={300}
                alt="shared"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl?.split("/").pop()}</span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );
};


  const renderChannelMessages = (message) => {
    const isUser = message.sender._id === userInfo.id;
    console.log(isUser);

    return (
      <div className={`mt-5 ${isUser ? "text-right" : "text-left"}`}>
        {message.messageType === "text" && (
          <div
            className={`${
              isUser
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-br-lg rounded-tl-lg"
        : "bg-[#2a2b33]/5 text-white /80 border--[#ffffff]/20 rounded-br-lg rounded-tl-lg"
            } border inline-block p-4 rounded my-1 max-w-[505px] break-words ml-9 text-right`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && renderFileMessage(message)}

        {!isUser ? (
          <div className="flex items-center justify-start gap-3 mt-1">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName ? message.sender.firstName[0] : message.sender.empid[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <span className="text-xs text-white/60">{moment(message.timestamp).format("LT")}</span>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1">{moment(message.timestamp).format("LT")}</div>
        )}
      </div>
    );
  };

  const renderMessage = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessage()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img src={`${HOST}${imageUrl}`} className="h-[80vh] w-full object-cover" alt="preview" />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
               setshowImage(false);
               setimageUrl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
