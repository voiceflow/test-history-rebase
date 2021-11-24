import { Utils } from '@voiceflow/common';

import client from '@/client/feature';

import suite from './_suite';

suite('Client - Feature', ({ expect, stubFetch }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['getStatuses']);
  });

  describe('getStatuses()', () => {
    it('should get all feature statuses', async () => {
      const features = Utils.generate.object();
      const fetch = stubFetch('api').resolves(features);

      const result = await client.getStatuses();

      expect(result).to.eq(features);
      expect(fetch).to.be.calledWithExactly('features/status');
    });

    it('should get all feature statuses with context', async () => {
      const features = Utils.generate.object();
      const fetch = stubFetch('api').resolves(features);

      const result = await client.getStatuses({ workspaceID: '123' });

      expect(result).to.eq(features);
      expect(fetch).to.be.calledWithExactly('features/status?workspaceID=123');
    });
  });
});
