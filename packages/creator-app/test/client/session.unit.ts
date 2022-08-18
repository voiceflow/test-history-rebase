import { Utils } from '@voiceflow/common';
import { DEVICE_INFO } from '@voiceflow/ui';

import client, { SESSION_ENDPOINTS, SESSION_PATH } from '@/client/session';
import { SessionType } from '@/constants';

import suite from './_suite';

suite('Client - Session', ({ expectMembers, stubFetch }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['delete', 'create']);
  });

  describe('delete()', () => {
    it('delete session', async () => {
      const fetch = stubFetch('api', 'delete');

      await client.delete();

      expect(fetch).toBeCalledWith(SESSION_PATH);
    });
  });

  describe('create()', () => {
    it('create sessions', async () => {
      const user: any = Utils.generate.object();
      const authResponse = Utils.generate.object();
      const fetch = stubFetch('api', 'put').mockResolvedValue(authResponse);

      await Promise.all(
        Object.values(SessionType).map(async (sessionType) => {
          const result = await client.create(sessionType, user);

          expect(result).toEqual(authResponse);
          expect(fetch).toBeCalledWith(SESSION_ENDPOINTS[sessionType], { user, device: DEVICE_INFO, queryParams: {} });
        })
      );
    });
  });
});
