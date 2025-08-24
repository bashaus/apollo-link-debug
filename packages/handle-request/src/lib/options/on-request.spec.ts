import { testApolloLink } from "@apollo-link-debug/core";

import { createRequestLink } from "../request-link";
import { onRequestHandler } from "./on-request";

const OPERATION_NAME = "createRequestLink";

describe("createRequestLink", () => {
  describe("#onRequest", () => {
    it("should console log", async () => {
      const awsXRayLink = createRequestLink({
        onRequest: onRequestHandler,
      });

      const debugSpy = jest.spyOn(console, "debug");
      debugSpy.mockImplementationOnce(() => {
        /* */
      });

      const variables = {
        one: "one",
        two: "two",
      };

      await testApolloLink(
        awsXRayLink,
        () => ({
          operationName: OPERATION_NAME,
          variables,
        }),
        () => ({ data: {} }),
      );

      expect(debugSpy).toHaveBeenCalledTimes(1);
      expect(debugSpy).toHaveBeenCalledWith(OPERATION_NAME, variables);
    });
  });
});
