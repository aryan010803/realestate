import { errorHandler } from "./error.js";
import Jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  Jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // If there's an error, return a 403 response immediately
      return next(errorHandler(403, 'Forbidden'));
    }

   
    req.user = user;
    next();
  });
};
