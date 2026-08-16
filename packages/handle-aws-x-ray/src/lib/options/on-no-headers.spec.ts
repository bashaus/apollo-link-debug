import { gql } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";

import { AwsXRayLink } from "../aws-x-ray-link";
import { onNoHeadersHandler } from "./on-no-headers";

describe("AwsXRayLink", () => {
  describe("#onNoHeaders", () => {
    it("should console log", async () => {
      const awsXRayLink = new AwsXRayLink({
        onNoHeaders: onNoHeadersHandler,
      });

      const warnSpy = vi.spyOn(console, "warn");
      warnSpy.mockImplementationOnce(() => {
        /* */
      });

      await testApolloLink(
        awsXRayLink,
        () => ({
          query: gql`
            query AwsXRayLink {
              noop
            }
          `,
        }),
        () => ({ data: {} }),
      );

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        "AwsXRayLink",
        "aws-x-ray: no headers received",
      );
    });
  });
});
