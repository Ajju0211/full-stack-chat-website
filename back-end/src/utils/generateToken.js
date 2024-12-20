import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

export const generateToken = (user_id,res) => {
    const token = jwt.sign({ user_id }, process.env.JWT_TOKEN_KEY, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
};  