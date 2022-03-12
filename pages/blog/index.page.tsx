import { getAllBlogFilesFrontMatter } from "@/lib/mdx";
import siteMetadata from "@/data/siteMetadata";
import ListLayout from "@/layouts/ListLayout";
import { PageSEO } from "@/components/SEO";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { ComponentProps } from "react";
import { getAllTags } from "@/lib/tags";

export const POSTS_PER_PAGE = 5;

export const getStaticProps: GetStaticProps<{
  posts: ComponentProps<typeof ListLayout>["posts"];
  initialDisplayPosts: ComponentProps<typeof ListLayout>["initialDisplayPosts"];
  pagination: ComponentProps<typeof ListLayout>["pagination"];
  tags: Record<string, number>;
}> = async () => {
  const posts = await getAllBlogFilesFrontMatter();
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE);
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };
  const tags = await getAllTags("blog");

  return {
    props: { initialDisplayPosts, posts, pagination, tags },
  };
};

export default function Blog({
  posts,
  initialDisplayPosts,
  pagination,
  tags,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO
        title={`Blog - ${siteMetadata.author}`}
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
