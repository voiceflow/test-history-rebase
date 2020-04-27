import client from '@/client/feature';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - Feature', ({ expect, stubFetch, expectCall }) => {
  describe('find()', () => {
    it('should find all features', async () => {
      const features = generate.array();
      const fetch = stubFetch().resolves(features);

      await expectCall(client.find).toYield(features);

      expect(fetch).to.be.calledWithExactly('features');
    });
  });

  describe('isEnabled()', () => {
    it('should return the feature status', async () => {
      const featureID = 'abc';
      const fetch = stubFetch().resolves({ status: true });

      await expectCall(client.isEnabled, featureID).toYield(true);

      expect(fetch).to.be.calledWithExactly(`feature/${featureID}`);
    });
  });
});
