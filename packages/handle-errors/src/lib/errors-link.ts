import { ApolloLink, Observable } from "@apollo/client";

import {
  OnGraphQLErrorsCallback,
  onGraphQLErrorsHandler,
} from "./options/on-graphql-errors";
import {
  OnNetworkErrorCallback,
  onNetworkErrorHandler,
} from "./options/on-network-error";

export type ErrorsLinkOptions = {
  onGraphQLErrors: OnGraphQLErrorsCallback;
  onNetworkError: OnNetworkErrorCallback;
};

export class ErrorsLink extends ApolloLink {
  protected options: ErrorsLinkOptions;

  constructor(options: Partial<ErrorsLinkOptions> = {}) {
    super();

    this.options = {
      onGraphQLErrors: options.onGraphQLErrors ?? onGraphQLErrorsHandler,
      onNetworkError: options.onNetworkError ?? onNetworkErrorHandler,
    };
  }

  override request(
    operation: ApolloLink.Operation,
    forward: ApolloLink.ForwardFunction,
  ): Observable<ApolloLink.Result> {
    return new Observable<ApolloLink.Result>((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          if (result.errors && result.errors.length > 0) {
            let message = "";

            result.errors.forEach((graphQLError) => {
              message += `${graphQLError.message}\n`;

              graphQLError.locations?.forEach(({ line, column }) => {
                message += `  on line: ${line}, column: ${column}\n`;
              });
            });

            this.options.onGraphQLErrors({
              operation,
              errors: result.errors,
              message,
            });
          }

          observer.next?.(result);
        },
        error: (networkError) => {
          this.options.onNetworkError({ operation, error: networkError });
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
