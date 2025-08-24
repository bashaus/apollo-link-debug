# @apollo-link-debug/handle-timer

Describes the amount of time taken to process a GraphQL response via apollo.

## Installation

Requires **@apollo/client v4**.

```bash
npm i @apollo/client @apollo-link-debug/handle-timer
# - or -
yarn add @apollo/client @apollo-link-debug/handle-timer
```

## Usage

```typescript
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { TimerLink } from "@apollo-link-debug/handle-timer";

const client = new ApolloClient({
  uri: "https://localhost:3000/",
  cache: new InMemoryCache(),
  link: ApolloLink.from([new TimerLink()]),
});

const query = client.query({
  query: gql`query MyOperationName { ... }`,
  variables: {
    variableName: "variableValue",
  },
});
```

Example output:

```text
MyOperationName took 0.3 sec
```

## Options

### `onResponse: ({ operation, timerStart, timerEnd, difference }) => void`

A callback which occurs on every GraphQL response from the server. The
default is to log the operation name and value of `difference` which describes
the number of seconds between the start and end time.
