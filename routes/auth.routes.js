import { Router } from "express";
import {
  getRegisterPage,
  getLoginPage,
  postLogin,
  postRegister,
  getMe,
  logoutUser,
  getProfilePage,
  getVerifyEmailPage,
  verifyEmailToken,
  resendVerificationLink,
  getEditProfilePage,
  postEditProfile,
  getChangePasswordPage,
  postChangePassword,
  getResetPasswordPage,
} from "../controllers/auth.controller.js";
const router = Router();

// router.get("/register",getRegisterPage)

// router.get("/login",getLoginPage)

// router.post("/login",postLogin)

router.route("/login").get(getLoginPage).post(postLogin);
router.route("/register").get(getRegisterPage).post(postRegister);

router.route("/me").get(getMe);
router.route("/logout").get(logoutUser);

router.route("/profile").get(getProfilePage);

router.route("/verify-email").get(getVerifyEmailPage);

router.route("/resend-verification-link").post(resendVerificationLink);

router.route("/edit-profile").get(getEditProfilePage);

router
  .route("/change-password")
  .get(getChangePasswordPage)
  .post(postChangePassword);

router.route("/reset-password").get(getResetPasswordPage);

router.route("/verify-email-token").get(verifyEmailToken).post(postEditProfile);

export const authRoutes = router;
