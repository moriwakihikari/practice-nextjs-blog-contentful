import type { NextPage, InferGetStaticPropsType, GetStaticPaths } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import styles from "../styles/Home.module.css";
import { buildClient, IBlogFields } from "../lib/contentful";
import { EntryCollection } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const client = buildClient();

const getBlogEntries = async () => {
  const { items }: EntryCollection<IBlogFields> = await client.getEntries({
    content_type: "blog",
  });
  return items;
};
export const getStaticPaths: GetStaticPaths = async () => {
  const items = await getBlogEntries();
  const paths = items.map((item) => {
    return {
      params: { slug: item.fields.slug },
    };
  });
  return {
    paths,
    fallback: false,
  };
};
export const getStaticProps = async () => {
  const items = await getBlogEntries();
  return {
    props: {
      blogs: items,
    },
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Blog: NextPage<Props> = ({ blogs }) => {
  const router = useRouter();
  if (!router.isFallback && !blogs[0].fields.slug) {
    return <ErrorPage statusCode={404} />;
  }
  const post = blogs[0];
  return (
    <div className={styles.container}>
      <Head>
        <title>{post.fields.title}</title>
      </Head>
      <main>
        <h1>{post.fields.title}</h1>
        <div>{documentToReactComponents(post.fields.content)}</div>
      </main>
    </div>
  );
};

export default Blog;