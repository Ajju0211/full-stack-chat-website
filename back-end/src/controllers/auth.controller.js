import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import cloudinary from "../libs/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {

        if(!password || !email || !fullName) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if(password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
        const user = await User.findOne({ email });
        if(user) return res.status(400).json({ error: "User already exists" });
        const salt = await bcrypt.genSalt(10);
        const Hashpass = await bcrypt.hash(password,salt);
    
        const newUser = await User.create({
            fullName,
            email,
            password:Hashpass
        });

        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();
            
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else {
            res.status(400).json({ error: "User not created" });
        }
        
    } catch (error) {
        console.log("Errore in signup controller", error);
        res.status(400).json({ 
            message: "Something went wrong",
            error: error.message });
    }
    
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if(!email) return res.status(400).json({ error: "Invalid credentials" });
        const userFound = await User.findOne({ email });
        if(!userFound) return res.status(400).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password,userFound.password);
        if(!match) return res.status(400).json({ error: "Invalid credentials" });
        generateToken(userFound._id,res);
        res.status(200).json({
            _id: userFound._id,
            fullName: userFound.fullName,
            email: userFound.email,
            profilePic: userFound.profilePic,
        });
    }
    catch(err) {
        console.log("Errore in login controller", err);
        res.status(400).json({ 
            message: "Something went wrong",
            error: err.message });
    }
}

export const logout = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "User logged out successfully" });
    
}

export const updateProfile = async (req, res) => {

    try {
        const { profilePic } = req.body;
       const userId = req.user._id = req.user._id;

       if(!profilePic) {    
        return res.status(400).json({ error: "Profile picture is required" });
       }
       const uploadResponse = await cloudinary.uploader.upload(profilePic)
       const updatedUser = await User.findByIdAndUpdate(userId, {
        profilePic: uploadResponse.secure_url
       },{
        new: true
       });
       res.status(200).json({
        updatedUser
       });

    }
    catch(err) {
        
    }
}

export const checkAuth = (req, res) => {

    try {
        res.status(200).json(req.user);
    }
    catch(err) {
        console.log("Error in checkAuth controller", err.message);
        res.status(400).json({ 
            message: "Something went wrong",
            error: err.message });
    }
}