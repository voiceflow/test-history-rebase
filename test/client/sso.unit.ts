import client from '@/client/sso';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - SSO', ({ expect, stubFetch }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['login']);
  });

  describe('login()', () => {
    it('login with SSO', async () => {
      const payload: any = generate.object();
      const authResponse = generate.object();
      const fetch = stubFetch('apiV2', 'post').resolves(authResponse);

      const result = await client.login(payload);

      expect(result).to.eq(authResponse);
      expect(fetch).to.be.calledWithExactly('sso/login', payload);
    });
  });
});
