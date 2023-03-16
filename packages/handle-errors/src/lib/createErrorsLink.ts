import { onError } from '@apollo/client/link/error';
import {
  OnGraphQLErrorsCallback,
  onGraphQLErrorsHandler,
} from './options/onGraphQLErrors';
import {
  OnNetworkErrorCallback,
  onNetworkErrorHandler,
} from './options/onNetworkError';

export type createErrorsLinkOptions = {
  onGraphQLErrors?: OnGraphQLErrorsCallback;
  onNetworkError?: OnNetworkErrorCallback;
};

/**
 * Error handler
 * Outputs error response information from the back-end
 */
export const createErrorsLink = ({
  onGraphQLErrors = onGraphQLErrorsHandler,
  onNetworkError = onNetworkErrorHandler,
}: createErrorsLinkOptions = {}) => {
  return onError((errorResponse) => {
    const { graphQLErrors, networkError, operation } = errorResponse;

    if (graphQLErrors) {
      let message = '';

      graphQLErrors.forEach((graphQLError) => {
        message += `${graphQLError.message}\n`;

        graphQLError.locations?.forEach(({ line, column }) => {
          message += `  on line: ${line}, column: ${column}\n`;
        });
      });

      onGraphQLErrors({ operation, errors: graphQLErrors, message });
      return;
    }

    if (networkError) {
      onNetworkError({ operation, error: networkError });
      return;
    }
  });
};
