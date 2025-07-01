import { Router } from "express";
import { verifyToken } from "../middleware/Authmiddleware.js";
import { createChannel, getChannelMessages, getUserChannels } from "../controllers/ChannelController.js";

const channelRoutes = Router();

channelRoutes.post("/createchannel",verifyToken,createChannel);
channelRoutes.get("/get-user-channels",verifyToken,getUserChannels);
channelRoutes.get("/get-channel-message/:channelId",verifyToken,getChannelMessages);

export default channelRoutes;