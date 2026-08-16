import { ApolloLink, Observable } from "@apollo/client";

import { OnAbortCallback, onAbortHandler } from "./options/on-abort";

export type AbortLinkOptions = {
  onAbort: OnAbortCallback;
};

export class AbortLink extends ApolloLink {
  protected options: AbortLinkOptions;

  constructor(options: Partial<AbortLinkOptions> = {}) {
    super();

    this.options = {
      onAbort: options.onAbort ?? onAbortHandler,
    };
  }

  private createAbortEventListener(operation: ApolloLink.Operation) {
    return () => {
      this.options.onAbort({ operation });
    };
  }

  private attachAbortHandler(operation: ApolloLink.Operation) {
    const context = operation.getContext();
    const { fetchOptions = {} } = context;
    const signal: AbortSignal | undefined = fetchOptions.signal;

    if (signal) {
      const abortHandler = this.createAbortEventListener(operation);
      operation.setContext({ abortHandler });
      signal.addEventListener("abort", abortHandler);
    }
  }

  private detachAbortHandler(operation: ApolloLink.Operation) {
    const context = operation.getContext();
    const { fetchOptions = {} } = context;
    const signal: AbortSignal | undefined = fetchOptions.signal;
    const abortHandler = context["abortHandler"];

    if (signal && abortHandler) {
      signal.removeEventListener("abort", abortHandler);
    }
  }

  override request(
    operation: ApolloLink.Operation,
    forward: ApolloLink.ForwardFunction,
  ): Observable<ApolloLink.Result> {
    this.attachAbortHandler(operation);

    return new Observable<ApolloLink.Result>((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          this.detachAbortHandler(operation);
          observer.next?.(result);
        },
        error: (networkError) => {
          this.detachAbortHandler(operation);
          observer.error?.(networkError);
        },
        complete: () => {
          this.detachAbortHandler(operation);
          observer.complete?.();
        },
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  }
}
