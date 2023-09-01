import { Utils } from '@voiceflow/common';

import client, { USER_PATH } from '@/client/user';

import suite from './_suite';

suite('Client - User', ({ expectMembers, stubFetch }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['get']);
  });

  describe('get()', () => {
    it('should get user details', async () => {
      const user = Utils.generate.object();
      const fetch = stubFetch('api', 'get').mockResolvedValue(user);

      const result = await client.get();

      expect(result).toEqual(user);
      expect(fetch).toBeCalledWith(USER_PATH);
    });
  });
});
