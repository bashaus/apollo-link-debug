# @apollo-link-debug/handle-abort

Debugs when a GraphQL request is aborted using an `AbortController`.

Because the same query can be used in multiple places with separate contexts, it is expected that the AbortController (signal) is provided when the query is run.

## Installation

```bash
npm i @apollo-link-debug/handle-abort
# - or -
yarn add @apollo-link-debug/handle-abort
```

## Usage

```typescript
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { createAbortLink } from '@apollo-link-debug/handle-abort';

const client = new ApolloClient({
  uri: 'https://localhost:3000/',
  cache: new InMemoryCache(),
  link: ApolloLink.from([createAbortLink()]),
});

/* */

const abortController = new AbortController();

const query = client.query({
  query: gql`query MyOperationName { ... }`,
  context: {
    fetchOptions: {
      signal: abortController.signal,
    },
  },
});

abortController.abort();
```

Example output:

```text
MyOperationName aborted
```

## Options

### `onAbort: ({ operation }) => void`

A callback which occurs when a GraphQL query is aborted. By default, this will console.log the operation name with the word `aborted`.
