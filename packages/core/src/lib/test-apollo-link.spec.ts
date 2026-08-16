import { ApolloLink } from "@apollo/client";
import { describe, expect, it } from "vitest";

import { testApolloLink } from "./test-apollo-link";

describe("testApolloLink", () => {
  it("uses the default request and response when omitted", async () => {
    const link = new ApolloLink((operation, forward) => forward(operation));

    await expect(testApolloLink(link)).resolves.toEqual(
      expect.objectContaining({
        operation: expect.objectContaining({
          query: expect.anything(),
        }),
      }),
    );
  });
});
