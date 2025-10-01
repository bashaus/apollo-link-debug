# @apollo-link-debug/\*

[![github actions build][img:gh-build]][url:gh-build]
[![code coverage][img:codecov]][url:codecov]

A collection of apollo links used to help debug GraphQL requests and responses.

See the individual packages for more information:

- [@apollo-link-debug/handle-abort](./packages/handle-abort/) – log when a GraphQL request has been cancelled.
- [@apollo-link-debug/handle-aws-x-ray](./packages/handle-aws-x-ray/) - log the unique URL for a GraphQL request to an AWS service implementing X-Ray.
- [@apollo-link-debug/handle-errors](./packages/handle-errors/) – debug public-facing errors returned from the GraphQL server.
- [@apollo-link-debug/handle-request](./packages/handle-request/) – debug the operation name and variables used for a GraphQL request.
- [@apollo-link-debug/handle-timer](./packages/handle-timer/) – debug the duration of an operation.

## Installation

Install the individual package(s) that you would like to use and connect them to your apollo client.

```bash
npm i \
  @apollo-link-debug/handle-request \
  @apollo-link-debug/handle-errors

# - or -

yarn add \
  @apollo-link-debug/handle-request \
  @apollo-link-debug/handle-errors
```

## Usage

```typescript
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { createRequestLink } from "@apollo-link-debug/handle-request";
import { createErrorsLink } from "@apollo-link-debug/handle-errors";

const client = new ApolloClient({
  uri: "https://localhost:3000/",
  cache: new InMemoryCache(),
  link: ApolloLink.from([createRequestLink(), createErrorsLink()]),
});
```

[url:posthtml]: https://github.com/posthtml/posthtml
[img:codecov]: https://codecov.io/gh/bashaus/apollo-link-debug/branch/main/graph/badge.svg?token=QJNOYSFXDH
[url:codecov]: https://codecov.io/gh/bashaus/apollo-link-debug
[img:gh-build]: https://github.com/bashaus/apollo-link-debug/actions/workflows/build.yml/badge.svg
[url:gh-build]: https://github.com/bashaus/apollo-link-debug/actions/workflows/build.yml
