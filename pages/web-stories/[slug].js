import { request, gql } from "graphql-request";

const WordPressGraphQLEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

const cleanStory = (content) => {
  let cleanContent = content.replace(/\r?\n|\r/gs, "");
  cleanContent = cleanContent.replace(/<p>/gs, "");
  cleanContent = cleanContent.replace(/<\/p>/gs, "");

  cleanContent = cleanContent.replace(
    /<html.*?>/g,
    `<!DOCTYPE html>\n<html amp="" lang="en">`
  );

  cleanContent = cleanContent.replace(
    /rel="stylesheet"/g,
    'rel="preload" as="style"'
  );

  cleanContent = cleanContent.replace(
    /<amp-story-page/,
    `<amp-story-auto-ads>
        <script type="application/json">
          {
            "ad-attributes": {
            "type": "adsense",
            "data-ad-client": "ca-pub-XXXXXXXXX", 
            "data-ad-slot": "XXXXXXXXX"
            }
          }
        </script>
      </amp-story-auto-ads>
      <amp-story-page
    `
  );

  return cleanContent;
};

const getCleanedContent = async (slug) => {
  const query = gql`
    query GETWEBSTORYBYSLUG($id: ID!) {
      webStory(id: $id, idType: SLUG) {
        content
        title
        slug
        featuredImage {
          node {
            mediaItemUrl
            altText
            description
          }
        }
      }
    }
  `;

  try {
    const data = await request(WordPressGraphQLEndpoint, query, {
      id: slug,
    });
    console.log(data?.webStory.content);

    return {
      cleanedContent: cleanStory(data?.webStory.content),
      featuredImage: data?.webStory.featuredImage?.node?.mediaItemUrl,
    };
  } catch (error) {
    console.error("Error fetching web story content:", error);
    return null;
  }
};

const WebStory = ({ cleanedContent, featuredImage }) => {
  return (
    <>
      {featuredImage && <link rel="preload" as="image" href={featuredImage} />}
      <div dangerouslySetInnerHTML={{ __html: cleanedContent }} />
    </>
  );
};

export async function getServerSideProps({ params }) {
  const { cleanedContent, featuredImage } = await getCleanedContent(
    params.slug
  );

  return {
    props: {
      cleanedContent,
      featuredImage,
    },
  };
}

export default WebStory;
