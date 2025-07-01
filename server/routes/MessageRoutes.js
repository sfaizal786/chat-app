import { Router } from "express";
import { verifyToken } from "../middleware/Authmiddleware.js";
import { getMessages, uploadFile,markMessagesAsSeen } from "../controllers/MessagesController.js";
import multer from "multer";

const messageRoutes = Router();
const upload = multer({dest:"uploads/files/"});

messageRoutes.post("/upload-file",verifyToken,upload.single("files"),uploadFile);

messageRoutes.post("/get-message",verifyToken, getMessages);
messageRoutes.post("/mark-as-seen", verifyToken, markMessagesAsSeen);

export default messageRoutes;