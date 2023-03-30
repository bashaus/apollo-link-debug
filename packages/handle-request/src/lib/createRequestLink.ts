import { ApolloLink } from '@apollo/client';
import { OnRequestCallback, onRequestHandler } from './options/onRequest';

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
