import { ApolloLink, gql, Observable } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";
import { map } from "rxjs/operators";

import { AbortLink } from "./abort-link";

describe("AbortLink", () => {
  it("should not trigger when successful", async () => {
    const onAbort = vi.fn();
    const abortLink = new AbortLink({ onAbort });

    const abortController = new AbortController();

    await testApolloLink(abortLink, () => ({
      query: gql`
        query AbortLink {
          noop
        }
      `,
      context: {
        fetchOptions: {
          signal: abortController.signal,
        },
      },
    }));

    expect(onAbort).not.toHaveBeenCalled();
  });

  it("should display on abort signal fired", async () => {
    const onAbort = vi.fn();
    const abortLink = new AbortLink({ onAbort });

    const abortController = new AbortController();

    const deferLink = new ApolloLink((operation, forward) => {
      return new Observable((observer) => {
        const timeout = setTimeout(() => {
          const subscription = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });

          return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
          };
        }, 1);

        return () => {
          clearTimeout(timeout);
        };
      });
    });

    // Prepare the link
    const testLinkPromise = testApolloLink(
      ApolloLink.from([abortLink, deferLink]),
      () => ({
        query: gql`
          query AbortLink {
            noop
          }
        `,
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

  it("should complete without firing the abort callback", async () => {
    const onAbort = vi.fn();
    const abortLink = new AbortLink({ onAbort });
    const abortController = new AbortController();
    const completeLink = new ApolloLink(() => {
      return new Observable((observer) => {
        observer.complete();
        return () => undefined;
      });
    });

    await expect(
      testApolloLink(ApolloLink.from([abortLink, completeLink]), () => ({
        query: gql`
          query AbortLink {
            noop
          }
        `,
        context: {
          fetchOptions: {
            signal: abortController.signal,
          },
        },
      })),
    ).resolves.toBeDefined();

    expect(onAbort).not.toHaveBeenCalled();
  });

  it("should handle no fetchOptions", async () => {
    const onAbort = vi.fn();
    const abortLink = new AbortLink({ onAbort });

    await testApolloLink(abortLink, () => ({
      query: gql`
        query AbortLink {
          noop
        }
      `,
      context: {},
    }));

    expect(onAbort).not.toHaveBeenCalled();
  });

  it("should not be called when an error occurs", async () => {
    const onAbort = vi.fn();
    const errorLink = new AbortLink({ onAbort });

    const throwLink = new ApolloLink((operation, forward) => {
      return forward(operation).pipe(
        map(() => {
          throw new Error();
        }),
      );
    });

    await expect(async () => {
      await testApolloLink(ApolloLink.from([errorLink, throwLink]), () => ({
        query: gql`
          query AbortLink {
            noop
          }
        `,
      }));
    }).rejects.toThrow();

    expect(onAbort).not.toHaveBeenCalled();
  });
});
