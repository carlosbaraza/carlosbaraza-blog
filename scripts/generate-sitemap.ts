import fs from "fs";
import globby from "globby";
import prettier from "prettier";
import siteMetadata from "../data/siteMetadata";
import { getAllBlogFilesFrontMatter } from "../lib/getAllBlogFilesFrontMatter";

(async () => {
  const prettierConfig = await prettier.resolveConfig("./.prettierrc.js");
  const pages = await globby([
    "pages/*.page.js",
    "pages/*.page.tsx",
    "public/tags/**/*.xml",
    "!pages/_*.js",
    "!pages/_*.tsx",
    "!pages/api",
  ]);

  const articles = await getAllBlogFilesFrontMatter();

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
              .map((page) => {
                const path = page
                  .replace("pages/", "/")
                  .replace("public/", "/")
                  .replace(".page.js", "")
                  .replace(".page.tsx", "")
                  .replace(".page.mdx", "")
                  .replace(".page.md", "")
                  .replace("/feed.xml", "");
                const route = path === "/index" ? "" : path;
                if (
                  page.indexOf("pages/404") > -1 ||
                  page.indexOf(`pages/[...slug]`) > -1
                ) {
                  return;
                }
                return `
                        <url>
                            <loc>${siteMetadata.siteUrl}${route}</loc>
                        </url>
                    `;
              })
              .join("")}

            ${articles
              .map((article) => {
                if (article.draft) {
                  return;
                }
                return `
                        <url>
                            <loc>${siteMetadata.siteUrl}/${article.slug}</loc>
                        </url>
                `;
              })
              .join("")}
        </urlset>
    `;

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: "html",
  });

  fs.writeFileSync("public/sitemap.xml", formatted);
})();
