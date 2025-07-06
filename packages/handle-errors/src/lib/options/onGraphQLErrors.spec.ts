import { ApolloLink } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";
import { GraphQLError, Source } from "graphql";

import { createErrorsLink } from "../createErrorsLink";
import { onGraphQLErrorsHandler } from "./onGraphQLErrors";

const OPERATION_NAME = "createErrorsLink";

describe("createErrorsLink", () => {
  describe("#onGraphQLErrors", () => {
    it("should console log", async () => {
      const errorLink = createErrorsLink({
        onGraphQLErrors: onGraphQLErrorsHandler,
      });

      const errorLog = jest.spyOn(console, "error");
      errorLog.mockImplementationOnce(() => {
        /* */
      });

      const graphqlError = new GraphQLError("mock error message", {
        positions: [5],
        source: new Source(""),
      });

      await testApolloLink(
        ApolloLink.from([errorLink]),
        () => ({ operationName: OPERATION_NAME }),
        () => ({ errors: [graphqlError] }),
      );

      expect(errorLog).toHaveBeenCalledTimes(1);
      expect(errorLog).toHaveBeenCalledWith(
        OPERATION_NAME,
        "mock error message\n  on line: 1, column: 6\n",
      );
    });
  });
});
