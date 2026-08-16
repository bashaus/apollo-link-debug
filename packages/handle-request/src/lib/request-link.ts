import { ApolloLink, Observable } from "@apollo/client";

import { OnRequestCallback, onRequestHandler } from "./options/on-request";

export type RequestLinkOptions = {
  onRequest: OnRequestCallback;
};

export class RequestLink extends ApolloLink {
  protected options: RequestLinkOptions;

  constructor(options: Partial<RequestLinkOptions> = {}) {
    super();

    this.options = {
      onRequest: options.onRequest ?? onRequestHandler,
    };
  }

  override request(
    operation: ApolloLink.Operation,
    forward: ApolloLink.ForwardFunction,
  ): Observable<ApolloLink.Result> {
    const { onRequest } = this.options;

    return new Observable<ApolloLink.Result>((observer) => {
      onRequest({ operation });

      const subscription = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  }
}
