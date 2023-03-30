import { ApolloLink } from '@apollo/client';
import { testApolloLink } from '@apollo-link-debug/core';

import { createAbortLink } from './createAbortLink';

const OPERATION_NAME = 'createAbortLink';

describe('createAbortLink', () => {
  it('should not trigger when successful', async () => {
    const onAbort = jest.fn();
    const abortLink = createAbortLink({ onAbort });

    const abortController = new AbortController();

    await testApolloLink(abortLink, () => ({
      operationName: OPERATION_NAME,
      context: {
        fetchOptions: {
          signal: abortController.signal,
        },
      },
    }));

    expect(onAbort).not.toBeCalled();
  });

  it('should display on abort signal fired', async () => {
    const onAbort = jest.fn();
    const abortLink = createAbortLink({ onAbort });

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

    expect(onAbort).toBeCalled();
  });
});
