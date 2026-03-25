import fs from "fs/promises";
import mjml2html from "mjml";
import path from "path";
import ejs from "ejs";

export const getHtmlFromMjmlTemplate = async (templateLiteral, data) => {
  const mjmlTemplate = await fs.readFile(
    path.join(import.meta.dirname, "..", "emais"),
    "utf-8",
  );
  const filledTemlate = ejs.render(mjmlTemplate, data);
  return mjml2html(filledTemlate).html;
};
