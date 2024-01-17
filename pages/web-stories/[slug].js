import { useQuery, gql } from '@apollo/client';

const GET_WEB_STORY = gql`
  query GetWebStory($slug: String!) {
    webStory(slug: $slug) {
      title
      slug
      date
      content
      featuredImage {
        node {
          mediaItemUrl
        }
      }
    }
  }
`;

export default function WebStoryPage({ slug }) {
  const { loading, error, data } = useQuery(GET_WEB_STORY, {
    variables: { slug },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading web story</p>;

  const webStory = data.webStory;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: webStory.content }} />
    </div>
  );
}
