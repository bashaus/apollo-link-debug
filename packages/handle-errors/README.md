# @apollo-link-debug/handle-errors

Debugs errors returned in a GraphQL response via apollo to the console.

## Installation

```bash
npm i @apollo-link-debug/handle-errors
# - or -
yarn add @apollo-link-debug/handle-errors
```

## Usage

```typescript
import { ApolloClient, ApolloLink } from '@apollo/client';
import { createErrorsLink } from '@apollo-link-debug/handle-errors';

const client = new ApolloClient({
  uri: 'https://localhost:3000/',
  cache: new InMemoryCache(),
  link: ApolloLink.from([createErrorsLink()]),
});
```

Example output:

```text
MyOperationName GraphQL error
  on line: 1, column: 6
```

## Options

### `onGraphQLErrors: ({ operation, errors, message }) => void`

A callback which occurs when an error is returned from the GraphQL request. The
`errors` object is an array of errors returned from the server, and the
`message` is a string with a human-readable intepretation of the error.

### `onNetworkError: ({ operation, error }) => void`

A callback which occurs when there is an error outside of the GraphQL sphere.
For example, the server may not be contactable.
