import { ApolloLink, gql, Observable } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";
import { Headers } from "cross-fetch";

import { AwsXRayLink } from "./aws-x-ray-link";

describe("AwsXRayLink", () => {
  describe("#onNoHeaders", () => {
    it("should callback when no headers exist", async () => {
      const onNoHeaders = vi.fn();
      const awsXRayLink = new AwsXRayLink({ onNoHeaders });

      await testApolloLink(awsXRayLink, () => ({
        query: gql`
          query AwsXRayLink {
            noop
          }
        `,
      }));

      expect(onNoHeaders).toHaveBeenCalledTimes(1);
    });
  });

  describe("#onNoTraceId", () => {
    it("should callback when no trace id exists", async () => {
      const onNoTraceId = vi.fn();
      const awsXRayLink = new AwsXRayLink({ onNoTraceId });

      await testApolloLink(awsXRayLink, () => ({
        query: gql`
          query AwsXRayLink {
            noop
          }
        `,
        context: {
          response: {
            headers: new Headers(),
          },
        },
      }));

      expect(onNoTraceId).toHaveBeenCalledTimes(1);
    });
  });

  describe("#onNoSample", () => {
    it("should callback when query is not sampled", async () => {
      const onNoSample = vi.fn();
      const awsXRayLink = new AwsXRayLink({ onNoSample });

      await testApolloLink(awsXRayLink, () => ({
        query: gql`
          query AwsXRayLink {
            noop
          }
        `,
        context: {
          response: {
            headers: new Headers({
              "X-Amzn-Trace-Id":
                "Root=1-5759e988-bd862e3fe1be46a994272793;Sampled=0",
            }),
          },
        },
      }));

      expect(onNoSample).toHaveBeenCalledTimes(1);
    });
  });

  describe("#onResponse", () => {
    it("should report trace id", async () => {
      const onResponse = vi.fn();
      const awsXRayLink = new AwsXRayLink({ onResponse });

      const traceId = "1-5759e988-bd862e3fe1be46a994272793";

      await testApolloLink(awsXRayLink, () => ({
        query: gql`
          query AwsXRayLink {
            noop
          }
        `,
        context: {
          response: {
            headers: new Headers({
              "X-Amzn-Trace-Id": `Root=${traceId};Sampled=1`,
            }),
          },
        },
      }));

      expect(onResponse).toHaveBeenCalledTimes(1);
    });

    it("should complete without reporting trace data", async () => {
      const onResponse = vi.fn();
      const awsXRayLink = new AwsXRayLink({ onResponse });
      const completeLink = new ApolloLink(() => {
        return new Observable((observer) => {
          observer.complete();
          return () => undefined;
        });
      });

      await expect(
        testApolloLink(ApolloLink.from([awsXRayLink, completeLink]), () => ({
          query: gql`
            query AwsXRayLink {
              noop
            }
          `,
        })),
      ).resolves.toBeDefined();

      expect(onResponse).not.toHaveBeenCalled();
    });
  });
});
