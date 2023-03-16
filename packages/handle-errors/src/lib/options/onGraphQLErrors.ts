import { Operation } from '@apollo/client';
import { GraphQLError } from 'graphql';

export type OnGraphQLErrorsCallback = (options: {
  operation: Operation;
  errors: Readonly<Array<GraphQLError>>;
  message: string;
}) => void;

export const onGraphQLErrorsHandler: OnGraphQLErrorsCallback = ({
  operation,
  message,
}) => {
  const { operationName } = operation;
  console.error(operationName, message);
};
