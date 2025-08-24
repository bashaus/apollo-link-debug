import { ApolloLink } from "@apollo/client";

export type OnNoHeadersCallback = (options: {
  operation: ApolloLink.Operation;
}) => void;

export const onNoHeadersHandler: OnNoHeadersCallback = ({ operation }) => {
  const { operationName } = operation;
  console.warn(operationName, "aws-x-ray: no headers received");
};
