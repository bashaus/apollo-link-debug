import { ApolloLink } from '@apollo/client';
import { testApolloLink } from '@apollo-link-debug/core';
import { GraphQLError, Source } from 'graphql';

import { createErrorsLink } from './createErrorsLink';

const OPERATION_NAME = 'createErrorsLink';

describe('createErrorsLink', () => {
  it('should handle graphql errors', async () => {
    const onGraphQLErrors = jest.fn();
    const errorLink = createErrorsLink({ onGraphQLErrors });

    const graphqlError = new GraphQLError('mock error message', {
      positions: [5],
      source: new Source(''),
    });

    await testApolloLink(
      ApolloLink.from([errorLink]),
      () => ({ operationName: OPERATION_NAME }),
      () => ({ errors: [graphqlError] })
    );

    expect(onGraphQLErrors).toHaveBeenCalledTimes(1);
    expect(onGraphQLErrors).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `${graphqlError.message}\n  on line: 1, column: 6\n`,
      })
    );
  });

  it('should handle network errors', async () => {
    const onNetworkError = jest.fn();
    const errorLink = createErrorsLink({ onNetworkError });
    const networkError = new Error('network error');

    const throwLink = new ApolloLink((operation, forward) => {
      return forward(operation).map(() => {
        throw networkError;
      });
    });

    await expect(async () => {
      await testApolloLink(ApolloLink.from([errorLink, throwLink]), () => ({
        operationName: OPERATION_NAME,
      }));
    }).rejects.toThrow();

    expect(onNetworkError).toHaveBeenCalledTimes(1);
    expect(onNetworkError).toHaveBeenCalledWith(
      expect.objectContaining({
        error: networkError,
      })
    );
  });
});
