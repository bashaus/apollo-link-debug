import { Operation } from '@apollo/client';

export type OnNoHeadersCallback = (options: { operation: Operation }) => void;

export const onNoHeadersHandler: OnNoHeadersCallback = ({ operation }) => {
  const { operationName } = operation;
  console.warn(operationName, 'aws-x-ray: no headers received');
};
