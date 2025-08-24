import { ApolloLink } from "@apollo/client";

import { OnRequestCallback, onRequestHandler } from "./options/on-request";

export type createRequestLinkOptions = {
  onRequest?: OnRequestCallback;
};

export const createRequestLink = ({
  onRequest = onRequestHandler,
}: createRequestLinkOptions = {}) => {
  return new ApolloLink((operation, forward) => {
    onRequest({ operation });
    return forward(operation);
  });
};
