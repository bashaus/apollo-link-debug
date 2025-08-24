import { ApolloLink, gql, Observable } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";

import { AbortLink } from "../abort-link";
import { onAbortHandler } from "./on-abort";

describe("AbortLink", () => {
  describe("#onAbort", () => {
    it("should console log", async () => {
      const abortLink = new AbortLink({ onAbort: onAbortHandler });
      const infoSpy = vi.spyOn(console, "info");
      infoSpy.mockImplementationOnce(() => {
        /* */
      });

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

      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledWith("AbortLink", "aborted");
    });
  });
});
