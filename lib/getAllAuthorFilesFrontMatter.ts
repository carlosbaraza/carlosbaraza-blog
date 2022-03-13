import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { AuthorFrontMatter } from "types/AuthorFrontMatter";
import getAllFilesRecursively from "./utils/files";
import { root, formatSlug } from "./mdx-utils";

export async function getAllAuthorFilesFrontMatter() {
  const prefixPaths = path.join(root, "data", "authors");

  const files = getAllFilesRecursively(prefixPaths);

  const allFrontMatter: AuthorFrontMatter[] = [];

  files.forEach((file: string) => {
    // Replace is needed to work on Windows
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, "/");
    // Remove Unexpected File
    if (path.extname(fileName) !== ".md" && path.extname(fileName) !== ".mdx") {
      return;
    }
    const source = fs.readFileSync(file, "utf8");
    const matterFile = matter(source);

    const frontmatter = matterFile.data as AuthorFrontMatter;

    allFrontMatter.push({
      ...frontmatter,
      slug: frontmatter.slug || formatSlug(fileName),
      fileName,
    });
  });

  return allFrontMatter;
}
