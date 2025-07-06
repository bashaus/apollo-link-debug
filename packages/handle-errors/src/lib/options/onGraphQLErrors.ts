import { Operation } from "@apollo/client";
import { GraphQLFormattedError } from "graphql";

export type OnGraphQLErrorsCallback = (options: {
  operation: Operation;
  errors: Readonly<Array<GraphQLFormattedError>>;
  message: string;
}) => void;

export const onGraphQLErrorsHandler: OnGraphQLErrorsCallback = ({
  operation,
  message,
}) => {
  const { operationName } = operation;
  console.error(operationName, message);
};
