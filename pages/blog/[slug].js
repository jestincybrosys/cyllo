// pages/blog/[slug].js

import { request, gql } from 'graphql-request';
import Link from 'next/link';

const WordPressGraphQLEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

export default function Blog({ post }) {
  return (
    
    <div style={{margin:"30px 50px", overflow:"hidden"}}>
       <nav>
          <Link href="/">
            Home
          </Link>
          <Link href="/blog">
            blog
          </Link>
        </nav>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

export async function getStaticPaths() {
  // Fetch all post slugs
  const query = gql`
    query {
      posts {
        nodes {
          slug
        }
      }
    }
  `;

  const data = await request(WordPressGraphQLEndpoint, query);

  const paths = data.posts.nodes.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const query = gql`
    query($slug: String!) {
      postBy(slug: $slug) {
        id
        title
        content
      }
    }
  `;

  const variables = { slug: params.slug };
  const data = await request(WordPressGraphQLEndpoint, query, variables);

  return {
    props: {
      post: data.postBy,
    },
    revalidate: 60,
  };
}
