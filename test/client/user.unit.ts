import client, { USER_PATH } from '@/client/user';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - User', ({ expect, stubFetch }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['get', 'updateProfilePicture', 'getReferralCouponCode']);
  });

  describe('get()', () => {
    it('should get user details', async () => {
      const user = generate.object();
      const fetch = stubFetch('api', 'get').resolves(user);

      const result = await client.get();

      expect(result).to.eq(user);
      expect(fetch).to.be.calledWithExactly(USER_PATH);
    });
  });

  describe('updateProfilePicture()', () => {
    it('should get user details', async () => {
      const url = generate.string();
      const fetch = stubFetch('api', 'post');

      await client.updateProfilePicture(url);

      expect(fetch).to.be.calledWithExactly(`${USER_PATH}/profilePictureURL`, { url });
    });
  });
});
