import crypto from "crypto";
import { loadLinks,saveLinks,getLinkByShortCode } from "../models/shortener.model.js";
export const postURLShortener =async(req,res)=>{
    try {
      
         const {url,shortCode} = req.body;
         const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

         const links = await loadLinks();
        
          if(links[finalShortCode]){
            return res.status(400).send("Short code already exists. Please choose another.")
          }

        //     links[finalShortCode]=url;

        //    await saveLinks(links);

        await saveLinks({url,shortCode});
           return res.redirect("/")
    } catch (error) {
         return res.status(500).send("INernal server error")

    }
};

export const getShortenerPage =async (req,res)=>{
    try {
        const links = await loadLinks();


        return res.render("index",{links,host: req.host})
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
}

export const redirectToShortLiknk = async(req,res)=>{
try {
    const {shortCode} = req.params;
    // const links =await loadLinks();
    const link =  await getLinkByShortCode(shortCode);

    // if(!links[shortCode]) return res.status(404).send("404 error occured");
    if(!link) return res.redirect("/404");

    return res.redirect(link.url);
} catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
}
}