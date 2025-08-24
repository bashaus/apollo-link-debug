import { ApolloLink, Operation } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { parse } from "cookie";

import {
  OnNoHeadersCallback,
  onNoHeadersHandler,
} from "./options/on-no-headers";
import { OnNoSampleCallback, onNoSampleHandler } from "./options/on-no-sample";
import {
  OnNoTraceIdCallback,
  onNoTraceIdHandler,
} from "./options/on-no-trace-id";
import { OnResponseCallback, onResponseHandler } from "./options/on-response";

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
