import { ApolloLink, gql } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";
import { GraphQLError, Source } from "graphql";
import { map } from "rxjs/operators";

import { ErrorsLink } from "./errors-link";

describe("ErrorsLink", () => {
  it("should handle graphql errors", async () => {
    const onGraphQLErrors = vi.fn();
    const errorLink = new ErrorsLink({ onGraphQLErrors });

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

    expect(onGraphQLErrors).toHaveBeenCalledTimes(1);
    expect(onGraphQLErrors).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `${graphqlError.message}\n  on line: 1, column: 6\n`,
      }),
    );
  });

  it("should use the default graphql error handler without locations", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const errorLink = new ErrorsLink();
    const graphqlError = new GraphQLError("mock error message");

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

    expect(errorSpy).toHaveBeenCalledWith("ErrorsLink", "mock error message\n");
    errorSpy.mockRestore();
  });

  it("should handle network errors", async () => {
    const onNetworkError = vi.fn();
    const errorLink = new ErrorsLink({ onNetworkError });
    const networkError = new Error("network error");

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

    expect(onNetworkError).toHaveBeenCalledTimes(1);
    expect(onNetworkError).toHaveBeenCalledWith(
      expect.objectContaining({
        error: networkError,
      }),
    );
  });

  it("should pass through successful results without GraphQL errors", async () => {
    const onGraphQLErrors = vi.fn();
    const onNetworkError = vi.fn();
    const errorLink = new ErrorsLink({ onGraphQLErrors, onNetworkError });

    await testApolloLink(
      errorLink,
      () => ({
        query: gql`
          query ErrorsLink {
            noop
          }
        `,
      }),
      () => ({ data: { noop: true } }),
    );

    expect(onGraphQLErrors).not.toHaveBeenCalled();
    expect(onNetworkError).not.toHaveBeenCalled();
  });
});
