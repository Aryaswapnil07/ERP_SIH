// auth.middleware.js
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from "jsonwebtoken";
import { Student } from '../models/student.model.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token = 
      req.cookies?.accessToken || 
      req.header('Authorization')?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request. Token missing.");
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetch student from DB
    const student = await Student.findById(decodedToken?._id).select(
      "-password -refreshTokens" // ensure refreshTokens is hidden
    );

    if (!student) {
      throw new ApiError(401, "Invalid access token. Student not found.");
    }

    // Attach student to request
    req.student = student;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid or expired access token");
  }
});
