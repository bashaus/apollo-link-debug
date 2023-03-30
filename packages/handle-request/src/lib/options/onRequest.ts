import { Operation } from '@apollo/client';
export type OnRequestCallback = (options: { operation: Operation }) => void;

export const onRequestHandler: OnRequestCallback = ({ operation }) => {
  const { operationName, variables } = operation;
  console.debug(operationName, variables);
};
