import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { PostFrontMatter } from "types/PostFrontMatter";
import getAllFilesRecursively from "./utils/files";
import { root, formatSlug, dateSortDesc } from "./mdx-utils";

export async function getAllBlogFilesFrontMatter() {
  const prefixPaths = path.join(root, "data", "blog");

  const files = getAllFilesRecursively(prefixPaths);

  const allFrontMatter: PostFrontMatter[] = [];

  files.forEach((file: string) => {
    // Replace is needed to work on Windows
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, "/");
    // Remove Unexpected File
    if (path.extname(fileName) !== ".md" && path.extname(fileName) !== ".mdx") {
      return;
    }
    const source = fs.readFileSync(file, "utf8");
    const matterFile = matter(source);

    const frontmatter = matterFile.data as PostFrontMatter;
    if ("draft" in frontmatter && frontmatter.draft === true) return;
    allFrontMatter.push({
      ...frontmatter,
      slug: frontmatter.slug || formatSlug(fileName),
      fileName,
      date_published: frontmatter.date_published
        ? new Date(frontmatter.date_published).toISOString()
        : null,
    });
  });

  return allFrontMatter.sort((a, b) =>
    dateSortDesc(a.date_published, b.date_published)
  );
}
