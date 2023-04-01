# @apollo-link-debug/handle-request

Debugs the operation name and variables used for a GraphQL request via apollo.

## Installation

```bash
npm i @apollo-link-debug/handle-request
# - or -
yarn add @apollo-link-debug/handle-request
```

## Usage

```typescript
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { createRequestLink } from '@apollo-link-debug/handle-request';

const client = new ApolloClient({
  uri: 'https://localhost:3000/',
  cache: new InMemoryCache(),
  link: ApolloLink.from([createRequestLink()]),
});

const query = client.query({
  query: gql`query MyOperationName { ... }`,
  variables: {
    variableName: 'variableValue',
  },
});
```

Example output:

```text
MyOperationName {
  "variableName": "variableValue"
}
```

## Options

### `onRequest: ({ operation }) => void`

A callback which occurs on every GraphQL request as the request is made. The
default is to log the operation name and the variables (as JSON) used for
the query.
