import { DEVICE_INFO, generate } from '@voiceflow/ui';

import client, { SESSION_ENDPOINTS, SESSION_PATH } from '@/client/session';
import { SessionType } from '@/constants';

import suite from './_suite';

suite('Client - Session', ({ expect, stubFetch }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['delete', 'create']);
  });

  describe('delete()', () => {
    it('delete session', async () => {
      const fetch = stubFetch('api', 'delete');

      await client.delete();

      expect(fetch).to.be.calledWithExactly(SESSION_PATH);
    });
  });

  describe('create()', () => {
    it('create sessions', async () => {
      const user: any = generate.object();
      const authResponse = generate.object();
      const fetch = stubFetch('api', 'put').resolves(authResponse);

      await Promise.all(
        Object.values(SessionType).map(async (sessionType) => {
          const result = await client.create(sessionType, user);

          expect(result).to.eq(authResponse);
          expect(fetch).to.be.calledWithExactly(SESSION_ENDPOINTS[sessionType], { user, device: DEVICE_INFO });
        })
      );
    });
  });
});
