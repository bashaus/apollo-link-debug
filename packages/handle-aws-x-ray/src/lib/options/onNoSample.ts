import { Operation } from "@apollo/client";

export type OnNoSampleCallback = (options: { operation: Operation }) => void;

export const onNoSampleHandler: OnNoSampleCallback = ({ operation }) => {
  const { operationName } = operation;
  console.info(operationName, "aws-x-ray: not sampled");
};
