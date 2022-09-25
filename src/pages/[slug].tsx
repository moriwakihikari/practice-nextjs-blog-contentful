import type { NextPage, InferGetStaticPropsType, GetStaticPaths } from "next";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import styles from "../styles/Home.module.css";
import { buildClient, IBlogFields } from "../lib/contentful";
import { EntryCollection } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Header from '../components/header';
import Button from '@mui/material/Button';



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
  const [post, setPosts] = useState(blogs[0])
  const router = useRouter();
  const slugId = router.query.slug;
  if (!router.isFallback && !blogs[0].fields.slug) {
    return <ErrorPage statusCode={404} />;
  }
  useEffect(() => {
    for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].fields.slug === slugId) {
        setPosts(blogs[i]);
        break;
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>{post.fields.title}</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <h1>{post.fields.title}</h1>
        <div>{documentToReactComponents(post.fields.content)}</div>
        <Button onClick={() => router.back()}>
        戻る
      </Button>
      </main>
    </div>
  );
};

export default Blog;