import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided: Access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    if(!decoded) {
        return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.user_id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User does not exist" });
    } 

    req.user = user;
    next();

  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    res.status(401).json({ message: "Internal sever error" });
  }
};
