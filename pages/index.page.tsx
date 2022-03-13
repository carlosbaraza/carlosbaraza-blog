import Link from "@/components/Link";
import { PageSEO } from "@/components/SEO";
import Tag from "@/components/Tag";
import siteMetadata from "@/data/siteMetadata";
import { getAllBlogFilesFrontMatter } from "@/lib/getAllBlogFilesFrontMatter";
import formatDate from "@/lib/utils/formatDate";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { PostFrontMatter } from "types/PostFrontMatter";
import NewsletterForm from "@/components/NewsletterForm";
import { Header } from "./index/components/Header";
import Card from "@/components/Card";
import projectsData from "@/data/projectsData";

const MAX_DISPLAY = 5;

export const getStaticProps: GetStaticProps<{
  posts: PostFrontMatter[];
}> = async () => {
  const posts = await getAllBlogFilesFrontMatter();

  return { props: { posts } };
};

export default function Home({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO
        title={`${siteMetadata.title} - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />
      <div className="space-y-8">
        <Header />

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="space-y-2 pt-6 pb-6 md:space-y-5">
            <h1 className="text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Latest Posts
            </h1>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {!posts.length && "No posts found."}
            {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
              const { slug, date_published, title, summary, tags } =
                frontMatter;
              return (
                <li key={slug} className="py-12">
                  <article>
                    <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          <time dateTime={date_published}>
                            {formatDate(date_published)}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-5 xl:col-span-3">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-2xl font-bold leading-8 tracking-tight">
                              <Link
                                href={`/${slug}`}
                                className="text-gray-900 dark:text-gray-100"
                              >
                                {title}
                              </Link>
                            </h2>
                            <div className="flex flex-wrap">
                              {tags.map((tag) => (
                                <Tag key={tag} text={tag} />
                              ))}
                            </div>
                          </div>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                            {summary}
                          </div>
                        </div>
                        <div className="text-base font-medium leading-6">
                          <Link
                            href={`/${slug}`}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            aria-label={`Read "${title}"`}
                          >
                            Read more &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
          {posts.length > MAX_DISPLAY && (
            <div className="flex justify-center pt-12 text-base font-medium leading-6">
              <Link
                href="/blog"
                className="rounded-2xl bg-primary-500 px-5 py-3 font-bold text-primary-50 transition-colors hover:bg-primary-700 "
                aria-label="all posts"
              >
                Explore All Posts &rarr;
              </Link>
            </div>
          )}
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="space-y-2 pt-6 pb-6 md:space-y-5">
            <h1 className="text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Featured projects
            </h1>
            <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
              A busy mind is always looking for new challenges. These are some
              of my projects. You can find more on{" "}
              <Link
                href="/projects"
                className="font-semibold text-slate-500 hover:text-slate-600"
              >
                the projects page &rarr;
              </Link>
              .
            </p>
          </div>
          <div className="py-12">
            <div className="-m-4 flex flex-wrap justify-center">
              {projectsData
                .filter((p) => p.featured)
                .map((d) => (
                  <Card
                    key={d.title}
                    title={d.title}
                    description={d.description}
                    imgSrc={d.imgSrc}
                    href={d.href}
                  />
                ))}
            </div>
          </div>

          {posts.length > MAX_DISPLAY && (
            <div className="flex justify-center pt-12 text-base font-medium leading-6">
              <Link
                href="/projects"
                className="rounded-2xl bg-primary-500 px-5 py-3 font-bold text-primary-50 transition-colors hover:bg-primary-700 "
                aria-label="all posts"
              >
                Explore All Projects &rarr;
              </Link>
            </div>
          )}
        </div>

        {siteMetadata.newsletter.provider !== "" && (
          <div className="flex items-center justify-center pt-4">
            <NewsletterForm />
          </div>
        )}
      </div>
    </>
  );
}
