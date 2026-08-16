import { ApolloLink, gql } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";
import { GraphQLError, Source } from "graphql";

import { ErrorsLink } from "../errors-link";
import { onGraphQLErrorsHandler } from "./on-graphql-errors";

describe("ErrorsLink", () => {
  describe("#onGraphQLErrors", () => {
    it("should console log", async () => {
      const errorLink = new ErrorsLink({
        onGraphQLErrors: onGraphQLErrorsHandler,
      });

      const errorLog = vi.spyOn(console, "error");
      errorLog.mockImplementationOnce(() => {
        /* */
      });

      const graphqlError = new GraphQLError("mock error message", {
        positions: [5],
        source: new Source(""),
      });

      await testApolloLink(
        ApolloLink.from([errorLink]),
        () => ({
          query: gql`
            query ErrorsLink {
              noop
            }
          `,
        }),
        () => ({ errors: [graphqlError] }),
      );

      expect(errorLog).toHaveBeenCalledTimes(1);
      expect(errorLog).toHaveBeenCalledWith(
        "ErrorsLink",
        "mock error message\n  on line: 1, column: 6\n",
      );
    });
  });
});
