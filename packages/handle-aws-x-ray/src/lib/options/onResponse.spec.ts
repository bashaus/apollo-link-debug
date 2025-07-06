import { testApolloLink } from '@apollo-link-debug/core';
import { Headers } from 'cross-fetch';

import { createAwsXRayLink } from '../createAwsXRayLink';
import { onResponseHandler } from './onResponse';

const OPERATION_NAME = 'createAwsXRayLink';

describe('createAwsXRayLink', () => {
  describe('#onResponse', () => {
    it('should console log', async () => {
      const awsXRayLink = createAwsXRayLink({
        onResponse: onResponseHandler,
      });

      const infoSpy = jest.spyOn(console, 'info');
      infoSpy.mockImplementationOnce(() => {
        /* */
      });

      await testApolloLink(
        awsXRayLink,
        () => ({
          operationName: OPERATION_NAME,
          context: {
            response: {
              headers: new Headers({
                'X-Amzn-Trace-Id':
                  'Root=1-5759e988-bd862e3fe1be46a994272793;Sampled=1',
              }),
            },
          },
        }),
        () => ({ data: {} })
      );

      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledWith(
        OPERATION_NAME,
        'aws-x-ray: https://console.aws.amazon.com/xray/home#/traces/1-5759e988-bd862e3fe1be46a994272793'
      );
    });
  });
});
