import { Operation } from "@apollo/client";

export type OnNetworkErrorCallback = (options: {
  operation: Operation;
  error: Error;
}) => void;

export const onNetworkErrorHandler: OnNetworkErrorCallback = ({
  operation,
  error,
}) => {
  const { operationName } = operation;
  console.error(operationName, "network error", error);
};
