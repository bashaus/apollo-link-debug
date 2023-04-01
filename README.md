# @apollo-link-debug/\*

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
import { ApolloClient, ApolloLink } from '@apollo/client';
import { createRequestLink } from '@apollo-link-debug/handle-request';
import { createErrorsLink } from '@apollo-link-debug/handle-errors';

const client = new ApolloClient({
  uri: 'https://localhost:3000/',
  cache: new InMemoryCache(),
  link: ApolloLink.from([createRequestLink(), createErrorsLink()]),
});
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
