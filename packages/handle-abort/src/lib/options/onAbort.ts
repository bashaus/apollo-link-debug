import { Operation } from '@apollo/client';

export type OnAbortCallback = (options: { operation: Operation }) => void;

export const onAbortHandler: OnAbortCallback = ({ operation }) => {
  const { operationName } = operation;
  console.info(operationName, 'aborted');
};
