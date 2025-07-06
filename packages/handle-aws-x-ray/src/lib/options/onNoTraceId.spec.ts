import { testApolloLink } from '@apollo-link-debug/core';

import { createAwsXRayLink } from '../createAwsXRayLink';
import { onNoTraceIdHandler } from './onNoTraceId';

const OPERATION_NAME = 'createAwsXRayLink';

describe('createAwsXRayLink', () => {
  describe('#onNoTraceId', () => {
    it('should console log', async () => {
      const awsXRayLink = createAwsXRayLink({
        onNoTraceId: onNoTraceIdHandler,
      });

      const warnSpy = jest.spyOn(console, 'warn');
      warnSpy.mockImplementationOnce(() => {
        /* */
      });

      await testApolloLink(
        awsXRayLink,
        () => ({
          operationName: OPERATION_NAME,
          context: {
            response: {
              headers: new Headers({}),
            },
          },
        }),
        () => ({ data: {} })
      );

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        OPERATION_NAME,
        'aws-x-ray: x-amzn-trace-id not found in response header'
      );
    });
  });
});
