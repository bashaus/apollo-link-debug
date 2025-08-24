import { ApolloLink, gql } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";
import { map } from "rxjs/operators";

import { ErrorsLink } from "../errors-link";
import { onNetworkErrorHandler } from "./on-network-error";

describe("ErrorsLink", () => {
  describe("#onNetworkError", () => {
    it("should console log", async () => {
      const networkError = new Error("network error");
      const errorLink = new ErrorsLink({
        onNetworkError: onNetworkErrorHandler,
      });

      const errorLog = vi.spyOn(console, "error");
      errorLog.mockImplementationOnce(() => {
        /* */
      });

      const throwLink = new ApolloLink((operation, forward) => {
        return forward(operation).pipe(
          map(() => {
            throw networkError;
          }),
        );
      });

      await expect(async () => {
        await testApolloLink(ApolloLink.from([errorLink, throwLink]), () => ({
          query: gql`
            query ErrorsLink {
              noop
            }
          `,
        }));
      }).rejects.toThrow();

      expect(errorLog).toHaveBeenCalledTimes(1);
      expect(errorLog).toHaveBeenCalledWith(
        "ErrorsLink",
        "network error",
        networkError,
      );
    });
  });
});
