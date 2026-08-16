import { gql } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";
import { Headers } from "cross-fetch";

import { AwsXRayLink } from "../aws-x-ray-link";
import { onResponseHandler } from "./on-response";

describe("AwsXRayLink", () => {
  describe("#onResponse", () => {
    it("should console log", async () => {
      const awsXRayLink = new AwsXRayLink({
        onResponse: onResponseHandler,
      });

      const infoSpy = vi.spyOn(console, "info");
      infoSpy.mockImplementationOnce(() => {
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
              headers: new Headers({
                "X-Amzn-Trace-Id":
                  "Root=1-5759e988-bd862e3fe1be46a994272793;Sampled=1",
              }),
            },
          },
        }),
        () => ({ data: {} }),
      );

      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledWith(
        "AwsXRayLink",
        "aws-x-ray: https://console.aws.amazon.com/xray/home#/traces/1-5759e988-bd862e3fe1be46a994272793",
      );
    });
  });
});
