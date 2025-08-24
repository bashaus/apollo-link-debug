import { ApolloLink, Observable } from "@apollo/client";

import { OnResponseCallback, onResponseHandler } from "./options/on-response";

export type TimerLinkOptions = {
  onResponse: OnResponseCallback;
};

export class TimerLink extends ApolloLink {
  protected options: TimerLinkOptions;

  constructor(options: Partial<TimerLinkOptions> = {}) {
    super();

    this.options = {
      onResponse: options.onResponse ?? onResponseHandler,
    };
  }

  private startTimer(operation: ApolloLink.Operation) {
    operation.setContext({
      timerStart: new Date(),
    });
  }

  private stopTimer(operation: ApolloLink.Operation) {
    const { timerStart } = operation.getContext();
    if (!timerStart) return;

    const timerEnd = new Date();
    const difference = timerEnd.getTime() - timerStart.getTime();

    this.options.onResponse({
      operation,
      timerStart,
      timerEnd,
      difference,
    });
  }

  override request(
    operation: ApolloLink.Operation,
    forward: ApolloLink.ForwardFunction,
  ): Observable<ApolloLink.Result> {
    // ⏱️ Start timing before forwarding
    this.startTimer(operation);

    return new Observable<ApolloLink.Result>((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          this.stopTimer(operation); // ✅ report on success
          observer.next?.(result);
        },
        error: (networkError) => {
          this.stopTimer(operation); // ✅ report on error too
          observer.error?.(networkError);
        },
        complete: () => {
          observer.complete?.();
        },
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  }
}
