import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        // 1. Check if authorization header exists and starts with Bearer
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ success: fals, message: "Not authorized, no token" });
        }
        // 2. Extract token from header
        const token = authHeader.split(" ")[1];

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach user to request 
        req.user = await User.findById(decoded.id).select("-password");
        
        // 5. Call next middleware
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
}


export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized, admin only" });
  }
};