import crypto from "crypto";
import {
  getAllShortLinks,
  insertShortLink,
  getShortLinkByShortCode,
  checkLinks,
  findShortLinkById,
  updateShortCodeLink,
  deleteShortCodeById,
} from "../services/shortener.service.js";
import z from "zod";
import { shortenerSchema } from "../validators/shortener-validator.js";

export const postURLShortener = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const { url, shortCode } = req.body;
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    const links = await checkLinks(finalShortCode);

    if (links) {
      //   return res
      //     .status(400)
      //     .send("Short code already exists. Please choose another.");
      req.flash(
        "errors",
        "Url with that shortcode already exists, please choose another  ",
      );
      res.redirect("/");
    }

    //     links[finalShortCode]=url;

    //    await saveLinks(links);
    await insertShortLink({
      url,
      shortCode: finalShortCode,
      userId: req.user.id,
    });

    return res.redirect("/");
  } catch (error) {
    return res.status(500).send("Inerrnal server error");
  }
};

export const getShortenerPage = async (req, res) => {
  if (!req.user) return res.redirect("/login");
  try {
    // console.log(req.user.id);
    const links = await getAllShortLinks(req.user.id);
    // console.log(links);
    return res.render("index", {
      links,
      host: req.host,
      errors: req.flash("errors"),
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

export const getShortenerEditPage = async (req, res) => {
  if (!req.user) return res.redirect("/login");

  // const id = req.params;
  const { data: id, error } = z.coerce.number().int().safeParse(req.params.id);

  if (error) {
    return res.direct("/404");
  }

  try {
    const shortLink = await findShortLinkById(id);
    if (!shortLink) return res.render("/404");

    res.render("edit-shortLink", {
      id: shortLink.id,
      url: shortLink.url,
      shortCode: shortLink.shortCode,
      errors: req.flash("errors"),
    });
  } catch (error) {
    return res.status(500).send("Interna server error");
  }
};

export const updateShortCode = async (req, res) => {
  if (!req.user) return res.redirect("/login");

  req.body.id = req.params.id;

  const { data, error } = shortenerSchema.safeParse(req.body);

  const { id, url, shortCode } = data;

  if (error) {
    return res.direct("/404");
  }

  try {
    const shortLink = await updateShortCodeLink({ id, url, shortCode });

    if (!shortLink) return res.render("/404");

    res.redirect("/");
  } catch (error) {
    return res.status(500).send("Interna server error");
  }
};

export const deleteShortCode = async (req, res) => {
  try {
    const { data: id, error } = z.coerce
      .number()
      .int()
      .safeParse(req.params.id);
    if (error) {
      return res.direct("/404");
    }

    await deleteShortCodeById(id);

    return res.redirect("/");
  } catch (error) {
    return res.status(500).send("Interna server error");
  }
};
