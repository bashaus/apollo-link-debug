import { Operation } from '@apollo/client';
export type OnResponseCallback = (options: {
  operation: Operation;
  traceId: string;
}) => void;

export const onResponseHandler: OnResponseCallback = ({
  operation,
  traceId,
}) => {
  const { operationName } = operation;

  console.info(
    operationName,
    `aws-x-ray: https://console.aws.amazon.com/xray/home#/traces/${traceId}`
  );
};
