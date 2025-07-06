import {
  ApolloLink,
  execute,
  FetchResult,
  gql,
  GraphQLRequest,
  Observable,
  Operation,
} from "@apollo/client";

const MockQuery = gql`
  query {
    thing
  }
`;

interface LinkResult<T> {
  operation: Operation;
  result: FetchResult<T>;
}

const DEFAULT_REQUEST: GraphQLRequest = { query: MockQuery };

export async function testApolloLink<
  T = unknown,
  U extends Record<string, unknown> = Record<string, unknown>,
>(
  linkToTest: ApolloLink,
  mockRequest: () => Partial<GraphQLRequest> = () => DEFAULT_REQUEST,
  mockResponse: () => FetchResult<U> = () => ({ data: null }),
) {
  const linkResult = {} as LinkResult<T>;

  return new Promise<LinkResult<T>>((resolve, reject) => {
    const terminatingLink = new ApolloLink((operation) => {
      linkResult.operation = operation;
      return Observable.of(mockResponse());
    });

    execute(ApolloLink.from([linkToTest, terminatingLink]), {
      ...DEFAULT_REQUEST,
      ...mockRequest(),
    }).subscribe(
      (result) => {
        linkResult.result = result as FetchResult<T>;
      },
      (error) => {
        reject(error);
      },
      () => {
        resolve(linkResult);
      },
    );
  });
}
