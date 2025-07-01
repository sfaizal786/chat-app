import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import authroutes from "./routes/Authroutes.js";
import contactsRoutes from "./routes/ContactRoute.js";
import {setupSocket} from "./socket.js";
import messageRoutes from "./routes/MessageRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
const databaseurl =process.env.DATABASE_URL;

app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials: true,
}));


app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files",express.static("uploads/files"));

app.use(cookieParser())
app.use(express.json());

app.use('/api/auth', authroutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/channel',channelRoutes);

const server = app.listen(port, ()=>{
    
});

setupSocket(server);
mongoose.connect(databaseurl);