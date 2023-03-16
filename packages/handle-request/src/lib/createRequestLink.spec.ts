import { testApolloLink } from '@apollo-link-debug/core';

import { createRequestLink } from './createRequestLink';

const OPERATION_NAME = 'createRequestLink';

describe('createRequestLink', () => {
  it('should report an operation', async () => {
    const onRequest = jest.fn();
    const requestLink = createRequestLink({ onRequest });

    const variables = {
      one: 'one',
      two: 'two',
    };

    await testApolloLink(requestLink, () => ({
      operationName: OPERATION_NAME,
      variables,
    }));

    expect(onRequest).toBeCalledTimes(1);
  });
});
