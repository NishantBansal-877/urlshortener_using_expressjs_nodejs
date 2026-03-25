import { refreshTokens, verifyJwtToken } from "../services/auth.services.js";

export const verifyAuthentication = async (req, res, next) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  req.user = null;

  if (!accessToken && !refreshToken) {
    return next();
  }

  // ✅ Access token
  if (accessToken) {
    try {
      const decodedToken = verifyJwtToken(accessToken);
      req.user = decodedToken;
      return next();
    } catch (err) {
      console.log("Access token error:", err.message);
    }
  }

  // ✅ Refresh token
  if (refreshToken) {
    try {
      const result = await refreshTokens(refreshToken);

      if (!result) return next();

      const { newAccessToken, newRefreshtoken, user } = result;

      req.user = user;

      const baseConfig = { httpOnly: true, secure: true };

      res.cookie("access_token", newAccessToken, {
        ...baseConfig,
        maxAge: ACCESS_TOKEN_EXPIRY,
      });

      res.cookie("refresh_token", newRefreshtoken, {
        ...baseConfig,
        maxAge: REFRESH_TOKEN_EXPIRY,
      });

      return next();
    } catch (error) {
      console.log("Refresh token error:", error.message);
    }
  }

  return next();
};
