import { ApolloLink, Operation } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { parse } from "cookie";

import { OnNoHeadersCallback, onNoHeadersHandler } from "./options/onNoHeaders";
import { OnNoSampleCallback, onNoSampleHandler } from "./options/onNoSample";
import { OnNoTraceIdCallback, onNoTraceIdHandler } from "./options/onNoTraceId";
import { OnResponseCallback, onResponseHandler } from "./options/onResponse";

export type createAwsXRayLinkOptions = {
  onResponse?: OnResponseCallback;
  onNoHeaders?: OnNoHeadersCallback;
  onNoSample?: OnNoSampleCallback;
  onNoTraceId?: OnNoTraceIdCallback;
};

export const createAwsXRayLink = ({
  onResponse = onResponseHandler,
  onNoHeaders = onNoHeadersHandler,
  onNoSample = onNoSampleHandler,
  onNoTraceId = onNoTraceIdHandler,
}: createAwsXRayLinkOptions = {}) => {
  const handler = ({ operation }: { operation: Operation }) => {
    const context = operation.getContext();
    const { response = {} } = context;
    const headers: Headers | undefined = response.headers;

    if (!headers) {
      onNoHeaders({ operation });
      return;
    }

    const traceId = headers.get("X-Amzn-Trace-Id");
    if (traceId === null) {
      onNoTraceId({ operation });
      return;
    }

    const params = parse(traceId);
    if (params["Sampled"] === "0") {
      onNoSample({ operation });
      return;
    }

    onResponse({ operation, traceId: params["Root"] });
  };

  const successHandler = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      handler({ operation });
      return response;
    });
  });

  const errorHandler = onError(({ operation }) => {
    handler({ operation });
  });

  return ApolloLink.from([successHandler, errorHandler]);
};
