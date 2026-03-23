import crypto from "crypto";
import {
  getAllShortLinks,
  insertShortLink,
  getShortLinkByShortCode,
  checkLinks,
} from "../services/shortener.service.js";
export const postURLShortener = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const { url, shortCode } = req.body;
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    const links = await checkLinks(finalShortCode);
    if (links) {
      return res
        .status(400)
        .send("Short code already exists. Please choose another.");
    }

    //     links[finalShortCode]=url;

    //    await saveLinks(links);

    await insertShortLink({ url, finalShortCode, userId: req.user.id });
    return res.redirect("/");
  } catch (error) {
    return res.status(500).send("Inerrnal server error");
  }
};

export const getShortenerPage = async (req, res) => {
  if (!req.user) return res.redirect("/login");
  try {
    const links = await getAllShortLinks();

    return res.render("index", {
      links,
      host: req.host,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

export const redirectToShortLiknk = async (req, res) => {
  try {
    const { shortCode } = req.params;
    // const links =await loadLinks();
    const link = await getShortLinkByShortCode(shortCode);

    // if(!links[shortCode]) return res.status(404).send("404 error occured");
    // if(!link) return res.redirect("/404");
    // ✅ Handle missing link properly
    if (!link) {
      return res.status(404).send("Short URL not found");
      // OR: return res.status(404).render("404");
    }
    return res.redirect(link.url);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};
