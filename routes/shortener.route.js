

import {Router} from "express";
import { postURLShortener ,getShortenerPage ,redirectToShortLiknk} from "../controllers/postshortener.controller.js";

const router = Router();


router.get("/",getShortenerPage);

router.post("/",postURLShortener);

router.get("/:shortCode",redirectToShortLiknk);

export default router;