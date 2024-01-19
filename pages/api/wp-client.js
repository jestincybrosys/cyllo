// src/clients/wp-client.js
import { GraphQLClient } from "graphql-request";

const WordPressGraphQLEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

const WPClient = new GraphQLClient(WordPressGraphQLEndpoint, {});

export default WPClient;
