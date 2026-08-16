import { gql } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";

import { AwsXRayLink } from "../aws-x-ray-link";
import { onNoTraceIdHandler } from "./on-no-trace-id";

describe("AwsXRayLink", () => {
  describe("#onNoTraceId", () => {
    it("should console log", async () => {
      const awsXRayLink = new AwsXRayLink({
        onNoTraceId: onNoTraceIdHandler,
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
          context: {
            response: {
              headers: new Headers({}),
            },
          },
        }),
        () => ({ data: {} }),
      );

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        "AwsXRayLink",
        "aws-x-ray: x-amzn-trace-id not found in response header",
      );
    });
  });
});
