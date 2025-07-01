import { useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';

export default function useNotifications(currentUserId) {
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handleNotification = (msg) => {
      const isSender = msg.sender === currentUserId;
      if (!isSender) {
        toast(`💬 ${msg.senderName || "Someone"}: ${msg.content || "sent a file"}`);
        
        // Optional: browser notification
        if (document.hidden && Notification.permission === "granted") {
          new Notification("New Message", {
            body: `${msg.senderName || "Someone"}: ${msg.content || "sent a file"}`,
          });
        }
      }
    };

    socket.on('receiveMessage', handleNotification);
    socket.on('receive-channel-message', handleNotification);

    return () => {
      socket.off('receiveMessage', handleNotification);
      socket.off('receive-channel-message', handleNotification);
    };
  }, [socket, currentUserId]);
}
