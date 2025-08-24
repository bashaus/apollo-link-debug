import { ApolloLink, Operation } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { OnResponseCallback, onResponseHandler } from "./options/on-response";

export type CreateTimerLinkOptions = {
  onResponse?: OnResponseCallback;
};

/**
 * Identifies how long it took to fulfil a GraphQL operation
 */
export const createTimerLink = ({
  onResponse = onResponseHandler,
}: CreateTimerLinkOptions = {}) => {
  const requestLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      timerStart: new Date(),
    });

    return forward(operation);
  });

  const responseHandler = (operation: Operation) => {
    const { timerStart } = operation.getContext();
    const timerEnd = new Date();
    const difference = timerEnd.getTime() - timerStart.getTime();

    onResponse({
      operation,
      timerStart,
      timerEnd,
      difference,
    });
  };

  const successLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((data) => {
      responseHandler(operation);
      return data;
    });
  });

  const errorLink = onError(({ operation }) => {
    responseHandler(operation);
  });

  return ApolloLink.from([requestLink, successLink, errorLink]);
};
