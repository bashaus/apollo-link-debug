import { ApolloLink } from "@apollo/client";

export type OnNoSampleCallback = (options: {
  operation: ApolloLink.Operation;
}) => void;

export const onNoSampleHandler: OnNoSampleCallback = ({ operation }) => {
  const { operationName } = operation;
  console.info(operationName, "aws-x-ray: not sampled");
};
