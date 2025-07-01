import { Router } from "express";
import { verifyToken } from "../middleware/Authmiddleware.js";
import { getAllContacts, getContactsForDMList, searchContacts } from "../controllers/ContactController.js";

const contactsRoutes =Router();

contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/get-contacts-for-dm",verifyToken,getContactsForDMList);
contactsRoutes.get("/get-all-contact", verifyToken, getAllContacts);

export default contactsRoutes;