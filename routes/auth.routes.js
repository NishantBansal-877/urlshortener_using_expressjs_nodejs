import { Router } from "express";
import {
  getRegisterPage,
  getLoginPage,
  postLogin,
  postRegister,
  getMe,
  logoutUser,
} from "../controllers/auth.controller.js";
const router = Router();

// router.get("/register",getRegisterPage)

// router.get("/login",getLoginPage)

// router.post("/login",postLogin)

router.route("/login").get(getLoginPage).post(postLogin);
router.route("/register").get(getRegisterPage).post(postRegister);

router.route("/me").get(getMe);
router.route("/logout").get(logoutUser);

export const authRoutes = router;
