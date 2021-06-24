import { generate } from '@voiceflow/ui';

import client from '@/client/integrations';

import suite from './_suite';

suite('Client - Integrations', ({ expect, stubFetch }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['getZapierToken']);
  });

  describe('getZapierToken()', () => {
    it('should get zapier integration token', async () => {
      const tokenResponse: any = generate.object();
      const fetch = stubFetch('api').resolves(tokenResponse);

      const result = await client.getZapierToken();

      expect(result).to.eq(tokenResponse);
      expect(fetch).to.be.calledWithExactly('api/token');
    });
  });
});
