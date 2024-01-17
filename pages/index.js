// pages/index.js

import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { request, gql } from "graphql-request";

const WordPressGraphQLEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

export default function Home({ siteTitle }) {
  return (
    <div className={styles.cyllo_home}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <nav
        className={styles.hone_nave}
        style={{ display: "flex", justifyContent: "end" }}
      >
        <Link href="/blog">Blog</Link>
        <Link href="/web-stories">Web Stories</Link>
      </nav>
      <div className={styles.maindiv}>
        <header>
          <h1>Welcome to {siteTitle}</h1>
        </header>
      </div>
      <section></section>
    </div>
  );
}

export async function getServerSideProps() {
  const query = gql`
    query {
      generalSettings {
        title
      }
    }
  `;

  try {
    const data = await request(WordPressGraphQLEndpoint, query);

    return {
      props: {
        siteTitle: data.generalSettings.title,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        siteTitle: "Your Default Title", // Provide a default title
      },
    };
  }
}
