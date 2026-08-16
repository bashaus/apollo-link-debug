import {
  ApolloClient,
  ApolloLink,
  execute,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { of } from "rxjs";

const MockQuery = gql`
  query {
    thing
  }
`;

interface LinkResult<T> {
  operation: ApolloLink.Operation;
  result: ApolloLink.Result<T>;
}

const DEFAULT_REQUEST: ApolloLink.Request = { query: MockQuery };

export async function testApolloLink<
  T = unknown,
  U extends Record<string, unknown> = Record<string, unknown>,
>(
  linkToTest: ApolloLink,
  mockRequest: () => Partial<ApolloLink.Request> = () => DEFAULT_REQUEST,
  mockResponse: () => ApolloLink.Result<U> = () => ({ data: null }),
) {
  const linkResult = {} as LinkResult<T>;

  return new Promise<LinkResult<T>>((resolve, reject) => {
    const terminatingLink = new ApolloLink((operation) => {
      linkResult.operation = operation;
      return of(mockResponse());
    });

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([]),
    });

    execute(
      ApolloLink.from([linkToTest, terminatingLink]),
      {
        ...DEFAULT_REQUEST,
        ...mockRequest(),
      },
      { client },
    ).subscribe({
      complete: () => {
        resolve(linkResult);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
