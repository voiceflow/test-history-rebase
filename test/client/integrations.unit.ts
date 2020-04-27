import client from '@/client/integrations';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - Integrations', ({ expect, stubFetch, expectCall }) => {
  describe('getZapierToken()', () => {
    it('should get zapier integration token', async () => {
      const data: any = generate.object();
      const fetch = stubFetch().resolves(data);

      await expectCall(client.getZapierToken).toYield(data);

      expect(fetch).to.be.calledWithExactly('api/token');
    });
  });
});
