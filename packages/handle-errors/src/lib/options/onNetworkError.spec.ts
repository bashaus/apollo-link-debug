import { ApolloLink } from '@apollo/client';
import { testApolloLink } from '@apollo-link-debug/core';

import { createErrorsLink } from '../createErrorsLink';
import { onNetworkErrorHandler } from './onNetworkError';

const OPERATION_NAME = 'createErrorsLink';

describe('createErrorsLink', () => {
  describe('#onNetworkError', () => {
    it('should console log', async () => {
      const networkError = new Error('network error');
      const errorLink = createErrorsLink({
        onNetworkError: onNetworkErrorHandler,
      });

      const errorLog = jest.spyOn(console, 'error');
      errorLog.mockImplementationOnce(() => {
        /* */
      });

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

      expect(errorLog).toHaveBeenCalledTimes(1);
      expect(errorLog).toHaveBeenCalledWith(
        OPERATION_NAME,
        'network error',
        networkError
      );
    });
  });
});
