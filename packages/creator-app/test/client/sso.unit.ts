import { Utils } from '@voiceflow/common';

import client, { SSO_PATH } from '@/client/sso';
import { SessionType } from '@/constants';

import suite from './_suite';

suite('Client - SSO', ({ expectMembers, stubFetch }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['login', 'convert']);
  });

  describe('login()', () => {
    it('login with SSO', async () => {
      const payload: any = Utils.generate.object();
      const authResponse = Utils.generate.object();
      const fetch = stubFetch('apiV2', 'post').mockResolvedValue(authResponse);

      const result = await client.login(payload);

      expect(result).toEqual(authResponse);
      expect(fetch).toBeCalledWith(`${SSO_PATH}/login`, payload);
    });
  });

  describe('convert()', () => {
    const payload: any = Utils.generate.object();

    it('fail on signup session type used', async () => {
      expect(() => client.convert(SessionType.SIGN_UP, payload)).toThrow('unable to convert account for this session type');
    });

    it('convert account to use SSO', async () => {
      const convertResponse = Utils.generate.object();
      const fetch = stubFetch('apiV2', 'post').mockResolvedValue(convertResponse);

      const result = await client.convert(SessionType.BASIC_AUTH, payload);

      expect(result).toEqual(convertResponse);
      expect(fetch).toBeCalledWith(`${SSO_PATH}/convert/basic`, payload);
    });
  });
});
