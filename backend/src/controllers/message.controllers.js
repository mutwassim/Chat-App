import User from "../models/user.model.js"
import Message from "../models/messages.model.js"
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req,res)=>{
    try {
        currentUserId = req.user._id;

        const filteredUser = await User.find({_id: { $ne : currentUserId } }).select("-password");

        res.status(200).json(filteredUser)
    } catch (error) {
        console.error("Error in getUserForSidebar: ",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}

export const getMessages = async (req,res)=>{
    try {
        const {id:userTOChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.fin({
            $or:[
                {senderId:myId,receiverId:userTOChatId},
                {senderId:userTOChatId,receiverId:myId}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.error("Error in getMessages: ",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}

export const sendMessage = async (req,res) =>{
    try {
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        res.status(201).json(newMessage)
    } catch (error) {
        console.error("Error in sendMessage: ",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}