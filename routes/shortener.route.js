import { Router } from "express";
import {
  postURLShortener,
  getShortenerPage,
  redirectToShortLiknk,
  getShortenerEditPage,
  updateShortCode,
  deleteShortCode,
} from "../controllers/postshortener.controller.js";

const router = Router();

router.get("/", getShortenerPage);

router.post("/", postURLShortener);

router.get("/:shortCode", redirectToShortLiknk);

router.route("/edit/:id").get(getShortenerEditPage).post(updateShortCode);

router.route("/delete/:id").post(deleteShortCode);

export const shortenerRoutes = router;
