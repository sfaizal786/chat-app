import mongoose from "mongoose";
import User from "../models/usermodel.js";
import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";
import path from "path";

// ✅ GET MESSAGES
export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).json({ error: "Both Users are required." });
    }

    const user1Id = new mongoose.Types.ObjectId(user1);
    const user2Id = new mongoose.Types.ObjectId(user2);

    const messages = await Message.find({
      $or: [
        { sender: user1Id, recipient: user2Id },
        { sender: user2Id, recipient: user1Id },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (err) {
    console.error("Error in getMessages:", err);
    return res.status(500).json({ error: err.message });
  }
};
// ✅ UPLOAD FILE
export const uploadFile = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).send("File required.");
    }

    const date = Date.now();
    const fileDir = `uploads/files/${date}`;
    const fileName = `${fileDir}/${request.file.originalname}`;

    mkdirSync(fileDir, { recursive: true });
    renameSync(request.file.path, fileName);

    // ✅ Return a relative path suitable for static serving
    const publicPath = `/uploads/files/${date}/${request.file.originalname}`;

    return response.status(200).json({ filePath: publicPath });
  } catch (err) {
    console.log( {err} );
    return response.status(500).send("Internal Server Error");
  }
};

// ✅ MARK MESSAGES AS SEEN
export const markMessagesAsSeen = async (req, res) => {
  try {
    const { senderId } = req.body;
    const userId = req.userId;

    await Message.updateMany(
      {
        sender: senderId,
        recipient: userId,
        seenBy: { $ne: userId },
      },
      { $addToSet: { seenBy: userId } } // ✅ use addToSet instead of push
    );

    return res.status(200).send("Messages marked as seen.");
  } catch (err) {
    console.error("❌ markMessagesAsSeen error:", err);
    return res.status(500).send("Internal Server Error");
  }
};
