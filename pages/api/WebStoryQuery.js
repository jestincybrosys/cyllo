// api/WebStoryQuery.js (or a similar file)
import { gql } from 'graphql-request';

export const QUERY_WEB_STORY_BY_SLUG = gql`
  query GetWebStoryBySlug($id: ID!, $slug: String!) {
    webStory(id: $id, idType: SLUG) {
      title
      content
      seo {
        title
        metaDesc
        opengraphImage {
          sourceUrl
        }
      }
      # Add other fields you need
    }
  }
`;
