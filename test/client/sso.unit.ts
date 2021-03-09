import client, { SSO_PATH } from '@/client/sso';
import { SessionType } from '@/constants';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - SSO', ({ expect, stubFetch }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['login', 'convert']);
  });

  describe('login()', () => {
    it('login with SSO', async () => {
      const payload: any = generate.object();
      const authResponse = generate.object();
      const fetch = stubFetch('apiV2', 'post').resolves(authResponse);

      const result = await client.login(payload);

      expect(result).to.eq(authResponse);
      expect(fetch).to.be.calledWithExactly(`${SSO_PATH}/login`, payload);
    });
  });

  describe('convert()', () => {
    const payload: any = generate.object();

    it('fail on signup session type used', async () => {
      expect(() => client.convert(SessionType.SIGN_UP, payload)).to.throw('unable to convert account for this session type');
    });

    it('convert account to use SSO', async () => {
      const convertResponse = generate.object();
      const fetch = stubFetch('apiV2', 'post').resolves(convertResponse);

      const result = await client.convert(SessionType.BASIC_AUTH, payload);

      expect(result).to.eq(convertResponse);
      expect(fetch).to.be.calledWithExactly(`${SSO_PATH}/convert/basic`, payload);
    });
  });
});
