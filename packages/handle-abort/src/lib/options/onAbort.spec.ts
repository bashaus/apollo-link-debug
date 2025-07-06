import { testApolloLink } from '@apollo-link-debug/core';
import { ApolloLink } from '@apollo/client';

import { createAbortLink } from '../createAbortLink';
import { onAbortHandler } from './onAbort';

const OPERATION_NAME = 'createAbortLink';

describe('createAbortLink', () => {
  describe('#onAbort', () => {
    it('should console log', async () => {
      const abortLink = createAbortLink({ onAbort: onAbortHandler });
      const infoSpy = jest.spyOn(console, 'info');
      infoSpy.mockImplementationOnce(() => {
        /* */
      });

      const abortController = new AbortController();

      const deferLink = new ApolloLink((operation, forward) => {
        operation.setContext(() => {
          return new Promise((resolve) => {
            setTimeout(() => resolve(true), 1);
          });
        });

        return forward(operation);
      });

      // Prepare the link
      const testLinkPromise = testApolloLink(
        ApolloLink.from([abortLink, deferLink]),
        () => ({
          operationName: OPERATION_NAME,
          context: {
            fetchOptions: {
              signal: abortController.signal,
            },
          },
        })
      );

      // Abort immediately
      abortController.abort();

      // Resolve the test
      await testLinkPromise;

      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledWith(OPERATION_NAME, 'aborted');
    });
  });
});
