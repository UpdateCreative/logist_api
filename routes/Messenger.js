const Router = require("express").Router();
const { ChatRoms, Chat, Read, Send } = require("../controllers/Messenger");
Router.get("/inbox", ChatRoms);
Router.get("/Conversation", Chat);
Router.post("/Read_message", Read);
Router.post("/Send_message", Send);

module.exports = Router;
