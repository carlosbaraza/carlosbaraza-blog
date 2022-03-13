import { PageSEO } from "@/components/SEO";
import siteMetadata from "@/data/siteMetadata";
import { getAllBlogFilesFrontMatter } from "@/lib/getAllBlogFilesFrontMatter";
import ListLayout from "@/layouts/ListLayout";
import { POSTS_PER_PAGE } from "../index.page";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { PostFrontMatter } from "types/PostFrontMatter";
import { getAllTags } from "@/lib/tags";

export const getStaticPaths: GetStaticPaths<{ page: string }> = async () => {
  const totalPosts = await getAllBlogFilesFrontMatter();
  const totalPages = Math.ceil(totalPosts.length / POSTS_PER_PAGE);
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  posts: PostFrontMatter[];
  initialDisplayPosts: PostFrontMatter[];
  pagination: { currentPage: number; totalPages: number };
  tags: Record<string, number>;
}> = async (context) => {
  const {
    params: { page },
  } = context;
  const posts = await getAllBlogFilesFrontMatter();
  const pageNumber = parseInt(page as string);
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  );
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };
  const tags = await getAllTags("blog");

  return {
    props: {
      posts,
      initialDisplayPosts,
      pagination,
      tags,
    },
  };
};

export default function PostPage({
  posts,
  initialDisplayPosts,
  pagination,
  tags,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO
        title={siteMetadata.title}
        description={siteMetadata.description}
      />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
        tags={tags}
      />
    </>
  );
}
