import { Utils } from '@voiceflow/common';

import client, { USER_PATH } from '@/client/user';

import suite from './_suite';

suite('Client - User', ({ expect, stubFetch }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members([
      'get',
      'updateProfilePicture',
      'updatePassword',
      'updateProfileName',
      'getReferralCouponCode',
      'resetEmail',
      'testResetPassword',
      'resetPassword',
      'resendConfirmationEmail',
      'confirmAccount',
    ]);
  });

  describe('get()', () => {
    it('should get user details', async () => {
      const user = Utils.generate.object();
      const fetch = stubFetch('api', 'get').resolves(user);

      const result = await client.get();

      expect(result).to.eq(user);
      expect(fetch).to.be.calledWithExactly(USER_PATH);
    });
  });

  describe('updateProfilePicture()', () => {
    it('should get user details', async () => {
      const url = Utils.generate.string();
      const fetch = stubFetch('api', 'post');

      await client.updateProfilePicture(url);

      expect(fetch).to.be.calledWithExactly(`${USER_PATH}/profilePictureURL`, { url });
    });
  });

  describe('getReferralCouponCode', () => {
    it('should fetch stripe promo code', async () => {
      const referrerID = 1;
      const referralCode = 'code';
      const stripePromotion = 'promo';

      const fetch = stubFetch('api', 'get').resolves(stripePromotion);

      const result = await client.getReferralCouponCode(referrerID, referralCode);

      expect(result).to.eq(stripePromotion);
      expect(fetch).to.be.calledWithExactly(`${USER_PATH}/referral/${referrerID}/${referralCode}`);
    });
  });

  describe('resetEmail', () => {
    it('should reset email', async () => {
      const email = Utils.generate.id();

      const fetch = stubFetch('api', 'post');

      await client.resetEmail(email);

      expect(fetch).to.be.calledWithExactly(`${USER_PATH}/reset`, { email });
    });
  });

  describe('testResetPassword', () => {
    it('should test if password can be reset', async () => {
      const resetCode = Utils.generate.id();

      const fetch = stubFetch('api', 'get');

      await client.testResetPassword(resetCode);

      expect(fetch).to.be.calledWithExactly(`${USER_PATH}/reset/${resetCode}`);
    });
  });

  describe('resetPassword', () => {
    it('should apply password reset', async () => {
      const resetCode = Utils.generate.id();
      const password = Utils.generate.string();

      const fetch = stubFetch('api', 'post');

      await client.resetPassword(resetCode, password);

      expect(fetch).to.be.calledWithExactly(`${USER_PATH}/reset/${resetCode}`, { password });
    });
  });

  describe('resendConfirmationEmail', () => {
    it('resend email confirmation', async () => {
      const fetch = stubFetch('api', 'post');

      await client.resendConfirmationEmail();

      expect(fetch).to.be.calledWithExactly(`${USER_PATH}/verify`);
    });
  });

  describe('confirmAccount', () => {
    it('Requesting account confirmation', async () => {
      const token = Utils.generate.string();

      const fetch = stubFetch('api', 'post');

      await client.confirmAccount(token);

      expect(fetch).to.be.calledWithExactly(`${USER_PATH}/verify/${token}`);
    });
  });
});
