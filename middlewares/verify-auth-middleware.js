import { verifyJwtToken } from "../services/auth.services.js";

export const verifyAuthentication = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    req.user = null;
  }

  try {
    const decodedToken = verifyJwtToken(token);
    req.user = decodedToken;
  } catch (error) {
    req.user = null;
  }
  next();
};
