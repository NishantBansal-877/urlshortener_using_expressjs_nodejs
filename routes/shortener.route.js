

import {Router} from "express";
import { postURLShortener ,getShortenerPage ,redirectToShortLiknk} from "../controllers/postshortener.controller.js";

const router = Router();


router.get("/",getShortenerPage)

router.post("/",postURLShortener);

router.get("/:shortCode",redirectToShortLiknk)


// router.get("/public/report",(req,res)=>{
//      const students = [
//   {
//     name: "Aarav",
//     grade: "10th",
//     favoriteSubject: "Mathematics"
//   },
//   {
//     name: "Diya",
//     grade: "9th",
//     favoriteSubject: "Science"
//   },
//   {
//     name: "Rohan",
//     grade: "10th",
//     favoriteSubject: "English"
//   },
//   {
//     name: "Ananya",
//     grade: "8th",
//     favoriteSubject: "History"
//   },
//   {
//     name: "Kabir",
//     grade: "9th",
//     favoriteSubject: "Geography"
//   }
// ];
//     return res.render("report",{students})
// })

export default router;