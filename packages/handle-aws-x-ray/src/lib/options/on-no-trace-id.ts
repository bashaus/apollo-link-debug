import { Operation } from "@apollo/client";

export type OnNoTraceIdCallback = (options: { operation: Operation }) => void;

export const onNoTraceIdHandler: OnNoTraceIdCallback = ({ operation }) => {
  const { operationName } = operation;
  console.warn(
    operationName,
    "aws-x-ray: x-amzn-trace-id not found in response header",
  );
};
