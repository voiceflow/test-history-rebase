import client from '@/client/feature';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - Feature', ({ expect, stubFetch }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['isEnabled', 'find']);
  });

  describe('find()', () => {
    it('should find all features', async () => {
      const features = generate.array();
      const fetch = stubFetch('api').resolves(features);

      const result = await client.find();

      expect(result).to.eq(features);
      expect(fetch).to.be.calledWithExactly('features');
    });
  });

  describe('isEnabled()', () => {
    it('should return the feature status', async () => {
      const featureID = 'abc';
      const fetch = stubFetch('api').resolves({ status: true });

      const result = await client.isEnabled(featureID);

      expect(result).to.be.true;
      expect(fetch).to.be.calledWithExactly(`feature/${featureID}`);
    });
  });
});
