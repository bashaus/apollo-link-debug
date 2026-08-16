import { ApolloLink, Observable } from "@apollo/client";
import { parseCookie } from "cookie";

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

export type AwsXRayLinkOptions = {
  onResponse: OnResponseCallback;
  onNoHeaders: OnNoHeadersCallback;
  onNoSample: OnNoSampleCallback;
  onNoTraceId: OnNoTraceIdCallback;
};

export class AwsXRayLink extends ApolloLink {
  protected options: AwsXRayLinkOptions;

  constructor(options: Partial<AwsXRayLinkOptions> = {}) {
    super();

    this.options = {
      onResponse: options.onResponse ?? onResponseHandler,
      onNoHeaders: options.onNoHeaders ?? onNoHeadersHandler,
      onNoSample: options.onNoSample ?? onNoSampleHandler,
      onNoTraceId: options.onNoTraceId ?? onNoTraceIdHandler,
    };
  }

  protected handle(operation: ApolloLink.Operation) {
    const context = operation.getContext();
    const { response = {} } = context;
    const headers: Headers | undefined = response.headers;

    if (!headers) {
      this.options.onNoHeaders({ operation });
      return;
    }

    const traceId = headers.get("X-Amzn-Trace-Id");
    if (traceId === null) {
      this.options.onNoTraceId({ operation });
      return;
    }

    const params = parseCookie(traceId);
    if (params["Sampled"] === "0") {
      this.options.onNoSample({ operation });
      return;
    }

    this.options.onResponse({ operation, traceId: params["Root"] });
  }

  override request(
    operation: ApolloLink.Operation,
    forward: ApolloLink.ForwardFunction,
  ): Observable<ApolloLink.Result> {
    return new Observable<ApolloLink.Result>((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          this.handle(operation);
          observer.next?.(result);
        },
        error: (networkError) => {
          this.handle(operation);
          observer.error?.(networkError);
        },
        complete: () => {
          observer.complete?.();
        },
      });

      return () => subscription.unsubscribe();
    });
  }
}
