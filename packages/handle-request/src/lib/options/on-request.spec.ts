import { gql } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";

import { RequestLink } from "../request-link";
import { onRequestHandler } from "./on-request";

describe("RequestLink", () => {
  describe("#onRequest", () => {
    it("should console log", async () => {
      const requestLink = new RequestLink({
        onRequest: onRequestHandler,
      });

      const debugSpy = vi.spyOn(console, "debug");
      debugSpy.mockImplementationOnce(() => {
        /* */
      });

      const variables = {
        one: "one",
        two: "two",
      };

      await testApolloLink(
        requestLink,
        () => ({
          query: gql`
            query RequestLink {
              noop
            }
          `,
          variables,
        }),
        () => ({ data: {} }),
      );

      expect(debugSpy).toHaveBeenCalledTimes(1);
      expect(debugSpy).toHaveBeenCalledWith("RequestLink", variables);
    });
  });
});
