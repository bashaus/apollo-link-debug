import { Operation } from '@apollo/client';

export type OnResponseCallback = (options: {
  operation: Operation;
  timerStart: Date;
  timerEnd: Date;
  difference: number;
}) => void;

export const onResponseHandler: OnResponseCallback = ({
  operation,
  difference,
}) => {
  const { operationName } = operation;
  console.log(operationName, `took ${difference / 1000} sec`);
};
