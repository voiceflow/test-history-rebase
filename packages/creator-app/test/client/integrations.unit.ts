import { Utils } from '@voiceflow/common';

import client from '@/client/integrations';

import suite from './_suite';

suite('Client - Integrations', ({ expectMembers, stubFetch }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['getZapierToken']);
  });

  describe('getZapierToken()', () => {
    it('should get zapier integration token', async () => {
      const tokenResponse: any = Utils.generate.object();
      const fetch = stubFetch('api').mockResolvedValue(tokenResponse);

      const result = await client.getZapierToken();

      expect(result).toEqual(tokenResponse);
      expect(fetch).toBeCalledWith('api/token');
    });
  });
});
