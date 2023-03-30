import { testApolloLink } from '@apollo-link-debug/core';

import { createAwsXRayLink } from '../createAwsXRayLink';
import { onNoHeadersHandler } from './onNoHeaders';

const OPERATION_NAME = 'createAwsXRayLink';

describe('createAwsXRayLink', () => {
  describe('#onNoHeaders', () => {
    it('should console log', async () => {
      const awsXRayLink = createAwsXRayLink({
        onNoHeaders: onNoHeadersHandler,
      });

      const warnSpy = jest.spyOn(console, 'warn');
      warnSpy.mockImplementationOnce(() => {
        /* */
      });

      await testApolloLink(
        awsXRayLink,
        () => ({
          operationName: OPERATION_NAME,
        }),
        () => ({ data: {} })
      );

      expect(warnSpy).toBeCalledTimes(1);
      expect(warnSpy).toBeCalledWith(
        OPERATION_NAME,
        'aws-x-ray: no headers received'
      );
    });
  });
});
