import fs from "fs";
import { bundleMDX } from "mdx-bundler";
import path from "path";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCitation from "rehype-citation";
import rehypeKatex from "rehype-katex";
import rehypePresetMinify from "rehype-preset-minify";
import rehypePrismPlus from "rehype-prism-plus";
// Rehype packages
import rehypeSlug from "rehype-slug";
import remarkFootnotes from "remark-footnotes";
// Remark packages
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { AuthorFrontMatter } from "types/AuthorFrontMatter";
import { PostFrontMatter } from "types/PostFrontMatter";
import { Toc } from "types/Toc";
import { getAllAuthorFilesFrontMatter } from "./getAllAuthorFilesFrontMatter";
import { getAllBlogFilesFrontMatter } from "./getAllBlogFilesFrontMatter";
import remarkCodeTitles from "./remark-code-title";
import remarkExtractFrontmatter from "./remark-extract-frontmatter";
import remarkImgToJsx from "./remark-img-to-jsx";
import remarkTocHeadings from "./remark-toc-headings";
import { root } from "./mdx-utils";
import getAllFilesRecursively from "./utils/files";

export function getFiles(type: "blog" | "authors") {
  const prefixPaths = path.join(root, "data", type);
  const files = getAllFilesRecursively(prefixPaths);
  // Only want to return blog/path and ignore root, replace is needed to work on Windows
  return files.map((file) =>
    file.slice(prefixPaths.length + 1).replace(/\\/g, "/")
  );
}

export const getBlogFileBySlug = async (slug: string) => {
  const allFiles = await getAllBlogFilesFrontMatter();
  const file = allFiles.find((f) => f.slug === slug);

  if (!file) {
    throw new Error(`No file found for slug: ${slug}`);
  }
  const filePath = path.join(root, "data", "blog", file.fileName);
  const source = fs.readFileSync(filePath, "utf8");

  // https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
  if (process.platform === "win32") {
    process.env.ESBUILD_BINARY_PATH = path.join(
      root,
      "node_modules",
      "esbuild",
      "esbuild.exe"
    );
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      root,
      "node_modules",
      "esbuild",
      "bin",
      "esbuild"
    );
  }

  const toc: Toc = [];

  const { code, frontmatter } = await bundleMDX<PostFrontMatter>({
    source,
    // mdx imports can be automatically source from the components directory
    cwd: path.join(root, "components"),
    xdmOptions(options, frontmatter) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkExtractFrontmatter,
        [remarkTocHeadings, { exportRef: toc }],
        remarkGfm,
        remarkCodeTitles,
        [remarkFootnotes, { inlineNotes: true }],
        remarkMath,
        remarkImgToJsx,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [rehypeCitation, { path: path.join(root, "data") }],
        [rehypePrismPlus, { ignoreMissing: true }],
        rehypePresetMinify,
      ];
      return options;
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        ".js": "jsx",
      };
      return options;
    },
  });

  return {
    mdxSource: code,
    toc,
    frontMatter: {
      readingTime: readingTime(code),
      slug: slug || null,
      fileName: file.fileName,
      ...frontmatter,
      date_published: frontmatter.date_published
        ? new Date(frontmatter.date_published).toISOString()
        : null,
    },
  };
};

export const getAuthorFileBySlug = async (slug: string) => {
  const allFiles = await getAllAuthorFilesFrontMatter();
  const file = allFiles.find((f) => f.slug === slug);

  if (!file) {
    throw new Error(`No file found for slug: ${slug}`);
  }
  const filePath = path.join(root, "data", "authors", file.fileName);
  const source = fs.readFileSync(filePath, "utf8");

  // https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
  if (process.platform === "win32") {
    process.env.ESBUILD_BINARY_PATH = path.join(
      root,
      "node_modules",
      "esbuild",
      "esbuild.exe"
    );
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      root,
      "node_modules",
      "esbuild",
      "bin",
      "esbuild"
    );
  }

  const toc: Toc = [];

  const { code, frontmatter } = await bundleMDX<AuthorFrontMatter>({
    source,
    // mdx imports can be automatically source from the components directory
    cwd: path.join(root, "components"),
    xdmOptions(options, frontmatter) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkExtractFrontmatter,
        [remarkTocHeadings, { exportRef: toc }],
        remarkGfm,
        remarkCodeTitles,
        [remarkFootnotes, { inlineNotes: true }],
        remarkMath,
        remarkImgToJsx,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [rehypeCitation, { path: path.join(root, "data") }],
        [rehypePrismPlus, { ignoreMissing: true }],
        rehypePresetMinify,
      ];
      return options;
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        ".js": "jsx",
      };
      return options;
    },
  });

  return {
    mdxSource: code,
    toc,
    frontMatter: {
      readingTime: readingTime(code),
      slug: slug || null,
      fileName: file.fileName,
      ...frontmatter,
    },
  };
};
