import { Utils } from '@voiceflow/common';

import client, { USER_PATH } from '@/client/user';

import suite from './_suite';

suite('Client - User', ({ expectMembers, stubFetch }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['get', 'getReferralCouponCode']);
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

  describe('getReferralCouponCode', () => {
    it('should fetch stripe promo code', async () => {
      const referrerID = 1;
      const referralCode = 'code';
      const stripePromotion = 'promo';

      const fetch = stubFetch('api', 'get').mockResolvedValue(stripePromotion);

      const result = await client.getReferralCouponCode(referrerID, referralCode);

      expect(result).toEqual(stripePromotion);
      expect(fetch).toBeCalledWith(`${USER_PATH}/referral/${referrerID}/${referralCode}`);
    });
  });
});
