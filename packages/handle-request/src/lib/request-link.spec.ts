import { ApolloLink, gql, Observable } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";

import { RequestLink } from "./request-link";

describe("RequestLink", () => {
  it("should report an operation", async () => {
    const onRequest = vi.fn();
    const requestLink = new RequestLink({ onRequest });

    const variables = {
      one: "one",
      two: "two",
    };

    await testApolloLink(requestLink, () => ({
      query: gql`
        query RequestLink {
          noop
        }
      `,
      variables,
    }));

    expect(onRequest).toHaveBeenCalledTimes(1);
  });

  it("should use the default request handler", async () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const requestLink = new RequestLink();

    await testApolloLink(requestLink, () => ({
      query: gql`
        query RequestLink {
          noop
        }
      `,
    }));

    expect(debugSpy).toHaveBeenCalledTimes(1);
    debugSpy.mockRestore();
  });

  it("should complete the request observable", async () => {
    const onRequest = vi.fn();
    const requestLink = new RequestLink({ onRequest });
    const completeLink = new ApolloLink(() => {
      return new Observable((observer) => {
        observer.complete();
        return () => undefined;
      });
    });

    await expect(
      testApolloLink(ApolloLink.from([requestLink, completeLink]), () => ({
        query: gql`
          query RequestLink {
            noop
          }
        `,
      })),
    ).resolves.toBeDefined();

    expect(onRequest).toHaveBeenCalledTimes(1);
  });
});
