// pages/web-stories.js
import styles from "./index.module.css";
import { request, gql } from "graphql-request";
import Link from "next/link";

const WordPressGraphQLEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = new Date(dateString).toLocaleDateString(
    "en-US",
    options
  );
  return formattedDate;
}

const WebStoriesPage = ({ webStories }) => {
  return (
    <div>
             <nav>
          <Link href="/">
            Home
          </Link>
          <Link href="/blog">
            blog
          </Link>
        </nav>
      <h1>Web Stories</h1>
      <div className={styles.cyllo_story}>
        {webStories.map(
          (story) =>
            story.featuredImage && (
              <div
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)) , url(${story.featuredImage.node.mediaItemUrl})`,
                }}
                key={story.slug}
                className={styles.cyllo_story_inner}
              >
                <div className={styles.cyllo_story_content}>
                  <div className={styles.cyllo_story_details}>
                    <Link href={`/web-stories/${story.slug}`}>
                      <h2>{story.title}</h2>
                    </Link>
                    <p>Published {formatDate(story.date)}</p>
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const itemsPerPage = 100; // Adjust this number based on your needs
  let webStories = [];
  let hasNextPage = true;
  let after = null;

  while (hasNextPage) {
    const query = gql`
      query GetWebStories($first: Int!, $after: String) {
        webStories(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            title
            slug
            date
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
      const data = await request(WordPressGraphQLEndpoint, query, {
        first: itemsPerPage,
        after: after,
      });

      webStories = webStories.concat(data.webStories.nodes);
      hasNextPage = data.webStories.pageInfo.hasNextPage;
      after = data.webStories.pageInfo.endCursor;
    } catch (error) {
      console.error("Error fetching web stories:", error);
      break;
    }
  }

  return {
    props: {
      webStories: webStories,
    },
    revalidate: 60, // Refresh every 60 seconds
  };
}

export default WebStoriesPage;
