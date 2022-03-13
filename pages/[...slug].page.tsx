import { MDXLayoutRenderer } from "@/components/MDXComponents";
import PageTitle from "@/components/PageTitle";
import generateRss from "@/lib/generate-rss";
import { getAuthorFileBySlug, getBlogFileBySlug } from "@/lib/mdx";
import { formatSlug } from "@/lib/mdx-utils";
import { getAllBlogFilesFrontMatter } from "@/lib/getAllBlogFilesFrontMatter";
import fs from "fs";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { AuthorFrontMatter } from "types/AuthorFrontMatter";
import { PostFrontMatter } from "types/PostFrontMatter";
import { Toc } from "types/Toc";

const DEFAULT_LAYOUT = "PostLayout";

export async function getStaticPaths() {
  const posts = await getAllBlogFilesFrontMatter();
  return {
    paths: posts.map((p) => ({
      params: {
        slug: formatSlug(p.slug || p.fileName).split("/"),
      },
    })),
    fallback: false,
  };
}

// @ts-ignore
export const getStaticProps: GetStaticProps<{
  post: { mdxSource: string; toc: Toc; frontMatter: PostFrontMatter };
  authorDetails: AuthorFrontMatter[];
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}> = async ({ params }) => {
  const slug = (params.slug as string[]).join("/");
  const allPosts = await getAllBlogFilesFrontMatter();
  const postIndex = allPosts.findIndex(
    (post) => formatSlug(post.slug) === slug
  );
  const prev: { slug: string; title: string } = allPosts[postIndex + 1] || null;
  const next: { slug: string; title: string } = allPosts[postIndex - 1] || null;
  const post = await getBlogFileBySlug(slug);

  const authorList = post.frontMatter.authors || ["default"];
  const authorPromise = authorList.map(async (author) => {
    const authorResults = await getAuthorFileBySlug(author);
    return authorResults.frontMatter;
  });
  const authorDetails = await Promise.all(authorPromise);

  // rss
  if (allPosts.length > 0) {
    const rss = generateRss(allPosts);
    fs.writeFileSync("./public/feed.xml", rss);
  }

  return {
    props: {
      post,
      authorDetails,
      prev,
      next,
    },
  };
};

export default function Blog({
  post,
  authorDetails,
  prev,
  next,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { mdxSource, toc, frontMatter } = post;

  return (
    <>
      {"draft" in frontMatter && frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={frontMatter.layout || DEFAULT_LAYOUT}
          toc={toc}
          mdxSource={mdxSource}
          frontMatter={frontMatter}
          authorDetails={authorDetails}
          prev={prev}
          next={next}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{" "}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  );
}
