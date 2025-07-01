import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ChatContainer from './components/chat-container';
import EmptyChatContainer from './components/empty-chat-container';
import ContactsContainer from './components/contacts-contsiner';
import { apiClient } from '@/lib/api-client';
import { GET_USER_INFO, MARK_AS_SEEN_ROUTE } from '../../utils/constant';

function Chat() {
  const {
    userInfo,
    setUserInfo,
    selectedChatData,
    selectedChatType,
    isUploading,
    isDownloading,
    fileuploadProgress,
    fileDownloadProgres,
  } = useAppStore();

  const navigate = useNavigate();
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ Fetch user info on mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        setUserInfo(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch user info:', err);
        toast.error("Failed to load user. Please log in again.");
        navigate("/auth");
      } finally {
        setLoadingUser(false);
      }
    };

    if (!userInfo || !userInfo.profileSetup) {
      toast("Please Set your Profile To Continue");
      navigate("/profile");
    } else if (!userInfo.firstName || !userInfo.lastName) {
      fetchUserInfo();
    } else {
      setLoadingUser(false);
    }
  }, [userInfo, navigate, setUserInfo]);

  // ✅ Mark direct messages as seen when user opens chat
  useEffect(() => {
    if (selectedChatType === "direct" && selectedChatData?._id) {
      apiClient.post(
        MARK_AS_SEEN_ROUTE,
        { senderId: selectedChatData._id },
        { withCredentials: true }
      ).catch((err) => {
        console.error("❌ Failed to mark messages as seen:", err);
      });
    }
  }, [selectedChatData?._id, selectedChatType]);

  if (loadingUser) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      {isUploading && (
        <div className='w-full h-full fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Uploading...</h5>
          {fileuploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className='w-full h-full fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Downloading...</h5>
          {fileDownloadProgres}%
        </div>
      )}
      <ContactsContainer />
      {selectedChatType === undefined ? <EmptyChatContainer /> : <ChatContainer />}
    </div>
  );
}

export default Chat;
