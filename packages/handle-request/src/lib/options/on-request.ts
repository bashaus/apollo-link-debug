import { ApolloLink } from "@apollo/client";

export type OnRequestCallback = (options: {
  operation: ApolloLink.Operation;
}) => void;

export const onRequestHandler: OnRequestCallback = ({ operation }) => {
  const { operationName, variables } = operation;
  console.debug(operationName, variables);
};
