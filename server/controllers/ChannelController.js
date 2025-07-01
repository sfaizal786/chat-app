import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/usermodel.js";

import { getSocketIdFromUserId, ioInstance } from "../socket.js"; // adjust path

export const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;

    // Validation & saving logic...
    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    await newChannel.save();

    // 🔥 Emit "newChannelCreated" to all added members
    [...members, userId].forEach((memberId) => {
      const socketId = getSocketIdFromUserId(memberId.toString());
      if (socketId) {
        ioInstance.to(socketId).emit("newChannelCreated", newChannel);
      }
    });

    return res.status(201).json({ channel: newChannel });
  } catch (err) {
    console.error("Error in createChannel:", err);
    return res.status(500).send("Internal Server error");
  }
};


export const getUserChannels = async (request, response, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(request.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 }); // <-- fixed typo here

    return response.status(201).json({ channels });
  } catch (err) {
console.log( {err} );
    return response.status(500).send("Internal Server error");
  }
};

export const getChannelMessages = async (request, response, next) => {
  try {
    const { channelId } = request.params;  // <-- expecting channelId in URL params
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName empid _id image color",
      },
    });

    if (!channel) {
      return response.status(404).send("Channel not found.");
    }

    const messages = channel.messages;
    return response.status(201).json({ messages });
  } catch (err) {
    console.log( {err} );
    return response.status(500).send("Internal Server error");
  }
};
