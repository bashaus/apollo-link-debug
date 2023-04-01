# @apollo-link-debug/handle-aws-x-ray

Provides a unique URL to debug a GraphQL query run via AWS X-Ray.

## Installation

```bash
npm i @apollo-link-debug/handle-aws-x-ray
# - or -
yarn add @apollo-link-debug/handle-aws-x-ray
```

## Usage

```typescript
import { ApolloClient, ApolloLink } from '@apollo/client';
import { createAwsXRayLink } from '@apollo-link-debug/handle-aws-x-ray';

const client = new ApolloClient({
  uri: 'https://localhost:3000/',
  cache: new InMemoryCache(),
  link: ApolloLink.from([createAwsXRayLink()]),
});
```

Example output:

```text
MyOperationName aws-x-ray: https://console.aws.amazon.com/xray/home#/traces/1-5759e988-bd862e3fe1be46a994272793
```

## Options

### `onResponse: ({ operation, traceId }) => void`

A callback which occurs when a query contains an AWS X-Ray trace ID.

### `onNoHeaders: ({ operation }) => void`

A callback which occurs when the HTTP headers cannot be read from a GraphQL response.

### `onNoSample: ({ operation }) => void`

A callback which occurs when the GraphQL request wasn't sampled by AWS X-Ray.

### `onNoTraceId: ({ operation }) => void`

A callback which occurs when the HTTP headers do not contain an X-Ray trace ID
header. This usually happens if you have not installed AWS X-Ray on the service
endpoint.
