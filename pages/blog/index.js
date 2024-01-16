// pages/blog/index.js
import styles from "./Blog.module.css"
import { request, gql } from 'graphql-request';
import Link from 'next/link';

const WordPressGraphQLEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

export default function Blog({ posts }) {
  return (
    <div>
      <header>
        <h1>Latest Blog Posts</h1>
        <nav>
          <Link href="/">
            Home
          </Link>
        </nav>
      </header>
      <section>
        <div>
          {posts.map((post) => (
            <div className={styles.cyllo_blog_div}>
            <div >
              <Link href={`/blog/${post.slug}`}>
                <h2 >{post.title}</h2>
              </Link>
  
              <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
              </div>

              {post.featuredImage && (
                <img
                  src={post.featuredImage.node.mediaItemUrl}
                  alt={`Featured Image for ${post.title}`}
                />
              )}
              </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export async function getStaticProps() {
  const query = gql`
    query {
      posts {
        nodes {
          id
          title
          excerpt
          slug
          featuredImage {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }
  `;

  try {
    const data = await request(WordPressGraphQLEndpoint, query);

    return {
      props: {
        posts: data.posts.nodes,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        posts: [],
      },
    };
  }
}
