import mongoose from "mongoose";
import User from "../models/usermodel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (request, response,next) => {
    try {
        const { searchTerm } = request.body;

        if (!searchTerm) {
            return response.status(400).send("searchTerm is required");
        }

        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(sanitizedSearchTerm, "i");

        const contacts = await User.find({
            _id: { $ne: request.userId },
            $or: [
                { firstName: regex },
                { lastName: regex },
                { empid: regex }
            ],
        });

        return response.status(200).json({ contacts });

    } catch (err) {
        console.error("searchContacts error:", err);
        return response.status(500).send("Internal Server Error");
    }
};

export const getContactsForDMList = async (request, response,next ) => {
    try {
        let { userId } = request;

        if (!userId) {
            return response.status(400).send("userId is required");
        }

        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { recipient: userId }
                    ]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            { $unwind: "$contactInfo" },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    empid: "$contactInfo.empid",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color"
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);

        return response.status(200).json({ contacts });

    } catch (err) {
        console.error("getContactsForDMList error:", err);
        return response.status(500).send("Internal Server Error");
    }
};

export const getAllContacts = async (request, response,next) => {
    try {
      
        const users = await User.find({
            _id: { $ne: request.userId }}, "firstName lastName _id empid");

        const contacts = users.map((user)=>({
            label: user.firstName 
            ?`${user.firstName}  ${user.lastName}`
            :user.empid, 
            value: user.id,
        }));
        return response.status(200).json({ contacts });

    } catch (err) {
        console.error("searchContacts error:", err);
        return response.status(500).send("Internal Server Error");
    }
};
