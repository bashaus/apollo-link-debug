import { ApolloLink, Operation } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

import { OnAbortCallback, onAbortHandler } from './options/onAbort';

export type CreateAbortLinkOptions = {
  onAbort?: OnAbortCallback;
};

export const createAbortLink = ({
  onAbort = onAbortHandler,
}: CreateAbortLinkOptions = {}) => {
  const requestHandler = new ApolloLink((operation, forward) => {
    const context = operation.getContext();
    const signal: AbortSignal | undefined = context['fetchOptions'].signal;

    if (signal) {
      const abortHandler = createAbortEventListener(operation);
      operation.setContext({ abortHandler });
      signal.addEventListener('abort', abortHandler);
    }

    return forward(operation);
  });

  const createAbortEventListener = (operation: Operation) => {
    return () => {
      onAbort({ operation });
    };
  };

  const responseHandler = (operation: Operation) => {
    const context = operation.getContext();

    const signal: AbortSignal | undefined = context['fetchOptions'].signal;
    const abortHandler = context['abortHandler'];

    if (signal && abortHandler) {
      signal.removeEventListener('abort', abortHandler);
    }
  };

  const successHandler = new ApolloLink((operation, forward) => {
    return forward(operation).map((data) => {
      responseHandler(operation);
      return data;
    });
  });

  const errorHandler = onError(({ operation }) => {
    responseHandler(operation);
  });

  return ApolloLink.from([requestHandler, successHandler, errorHandler]);
};
