import { Router } from "express";
import { getUserInfo, login, signup ,updateProfile, addProfileImage,removeProfileImage, logout, } from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/Authmiddleware.js";
import multer from "multer";


const authroutes = Router();
const upload = multer({dest:"uploads/profiles/"});
authroutes.post("/signup", signup);
authroutes.post("/login", login);
authroutes.post("/updateprofile", verifyToken,updateProfile);
authroutes.get("/userinfo", verifyToken, getUserInfo);
authroutes.post(
    "/addprofileimage",
    verifyToken , 
    upload.single("profile-image"),
    addProfileImage
);
authroutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authroutes.post("/logout", logout);
export default authroutes;