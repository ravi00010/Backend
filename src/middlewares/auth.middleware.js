import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"
import jwt, { decode } from "jsonwebtoken";
import { User } from "../models/user.models";

export const verifyJWT = asyncHandler(async(req, res,
next) => {
    try {
        const token = req.cookies?.accessToken || req.header
        ("Authorization")?.replace("Bearer", "")
    
    
        if(!token){
            throw new ApiError(401, "Unaouthorized request")
        }
    
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        nect()
    } catch (error) {
        throw new ApiError(401, error?.message || 
            "Invalid access token")
    }

})