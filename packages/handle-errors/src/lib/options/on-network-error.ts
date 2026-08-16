import { ApolloLink } from "@apollo/client";

export type OnNetworkErrorCallback = (options: {
  operation: ApolloLink.Operation;
  error: Error;
}) => void;

export const onNetworkErrorHandler: OnNetworkErrorCallback = ({
  operation,
  error,
}) => {
  const { operationName } = operation;
  console.error(operationName, "network error", error);
};
