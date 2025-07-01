import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

const userSocketMap = new Map(); // store userId -> socketId mappings

let ioInstance = null;

const getSocketIdFromUserId = (userId) => {
  return userSocketMap.get(userId);
};

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  ioInstance = io;

  const disconnect = (socket) => {
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    try {
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);

      const createdMessage = await Message.create(message);
      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id empid firstName lastName image color")
        .populate("recipient", "id empid firstName lastName image color");

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("recieveMessage", messageData);
      }

      if (senderSocketId) {
        io.to(senderSocketId).emit("recieveMessage", messageData);
      }

     
    } catch (err) {
      console.error("Error in sendMessage:", err);
    }
  };

  const sendChannelMessage = async (message) => {
    try {
      const { channelId, sender, content, messageType, fileUrl } = message;

      const createdMessage = await Message.create({
        sender,
        recipient: null,
        content,
        messageType,
        timestamp: new Date(),
        fileUrl,
      });

      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id empid firstName lastName image color")
        .exec();

      await Channel.findByIdAndUpdate(channelId, {
        $push: { messages: createdMessage._id },
      });

      const channel = await Channel.findById(channelId).populate("members admin").exec();
      if (!channel) {
        console.error(`Channel not found: ${channelId}`);
        return;
      }

      const finalData = {
        ...messageData.toObject(),
        channelId: channel._id,
      };

      const sentTo = new Set();

      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (
          memberSocketId &&
          member._id.toString() !== channel.admin._id.toString()
        ) {
          io.to(memberSocketId).emit("recieve-channel-message", finalData);
          sentTo.add(memberSocketId);
        }
      });

      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId && !sentTo.has(adminSocketId)) {
        io.to(adminSocketId).emit("recieve-channel-message", finalData);
      }


    } catch (err) {
      console.error("Error in sendChannelMessage:", err);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
    
    } else {
      console.warn("⚠️ userId not provided in socket handshake.");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export { setupSocket, ioInstance, getSocketIdFromUserId };
