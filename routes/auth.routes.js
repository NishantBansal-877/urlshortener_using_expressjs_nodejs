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
  postForgotPassword,
  getResetPasswordTokenPage,
  postResetPasswordToken,
  getGoogleLoginPage,
  getGoogleLoginCallback,
  getGithubLoginPage,
  getGithubLoginCallback,
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

router.route("/edit-profile").get(getEditProfilePage).post(postEditProfile);

router
  .route("/change-password")
  .get(getChangePasswordPage)
  .post(postChangePassword);

router
  .route("/reset-password")
  .get(getResetPasswordPage)
  .post(postForgotPassword);

router
  .route("/reset-password/:token")
  .get(getResetPasswordTokenPage)
  .post(postResetPasswordToken);

router.route("/verify-email-token").get(verifyEmailToken).post(postEditProfile);

router.route("/google").get(getGoogleLoginPage);
router.route("/google/callback").get(getGoogleLoginCallback);

router.route("/github").get(getGithubLoginPage);
router.route("/github/callback").get(getGithubLoginCallback);

export const authRoutes = router;
