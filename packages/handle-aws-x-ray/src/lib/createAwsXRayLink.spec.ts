import { testApolloLink } from "@apollo-link-debug/core";
import { Headers } from "cross-fetch";

import { createAwsXRayLink } from "./createAwsXRayLink";

const OPERATION_NAME = "createAwsXRayLink";

describe("createAwsXRayLink", () => {
  describe("#onNoHeaders", () => {
    it("should callback when no headers exist", async () => {
      const onNoHeaders = jest.fn();
      const xrayLink = createAwsXRayLink({ onNoHeaders });

      await testApolloLink(xrayLink, () => ({
        operationName: OPERATION_NAME,
      }));

      expect(onNoHeaders).toHaveBeenCalledTimes(1);
    });
  });

  describe("#onNoTraceId", () => {
    it("should callback when no trace id exists", async () => {
      const onNoTraceId = jest.fn();
      const xrayLink = createAwsXRayLink({ onNoTraceId });

      await testApolloLink(xrayLink, () => ({
        operationName: OPERATION_NAME,
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
      const onNoSample = jest.fn();
      const xrayLink = createAwsXRayLink({ onNoSample });

      await testApolloLink(xrayLink, () => ({
        operationName: OPERATION_NAME,
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
      const onResponse = jest.fn();
      const xrayLink = createAwsXRayLink({ onResponse });

      const traceId = "1-5759e988-bd862e3fe1be46a994272793";

      await testApolloLink(xrayLink, () => ({
        operationName: OPERATION_NAME,
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
  });
});
