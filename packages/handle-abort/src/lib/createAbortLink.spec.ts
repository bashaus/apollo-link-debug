import { ApolloLink } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";

import { createAbortLink } from "./createAbortLink";

const OPERATION_NAME = "createAbortLink";

const resolveOnTick = (resolve: (value: boolean) => void) => {
  setTimeout(() => resolve(true), 1);
};

describe("createAbortLink", () => {
  it("should not trigger when successful", async () => {
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

    expect(onAbort).not.toHaveBeenCalled();
  });

  it("should display on abort signal fired", async () => {
    const onAbort = jest.fn();
    const abortLink = createAbortLink({ onAbort });

    const abortController = new AbortController();

    const deferLink = new ApolloLink((operation, forward) => {
      operation.setContext(() => {
        return new Promise(resolveOnTick);
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
      }),
    );

    // Abort immediately
    abortController.abort();

    // Resolve the test
    await testLinkPromise;

    expect(onAbort).toHaveBeenCalled();
  });

  it("should handle no fetchOptions", async () => {
    const onAbort = jest.fn();
    const abortLink = createAbortLink({ onAbort });

    await testApolloLink(abortLink, () => ({
      operationName: OPERATION_NAME,
      context: {},
    }));

    expect(onAbort).not.toHaveBeenCalled();
  });

  it("should not be called when an error occurs", async () => {
    const onAbort = jest.fn();
    const errorLink = createAbortLink({ onAbort });

    const throwLink = new ApolloLink((operation, forward) => {
      return forward(operation).map(() => {
        throw new Error();
      });
    });

    await expect(async () => {
      await testApolloLink(ApolloLink.from([errorLink, throwLink]), () => ({
        operationName: OPERATION_NAME,
      }));
    }).rejects.toThrow();

    expect(onAbort).not.toHaveBeenCalled();
  });
});
