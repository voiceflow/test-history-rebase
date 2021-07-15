import { generate } from '@voiceflow/ui';

import * as Fixtures from '@/../test/_fixtures';
import client from '@/client';
import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import * as Session from '@/ducks/session';

import suite from './_suite';

const CREATOR_ID = 123;
const REFERRER_ID = 456;
const REFERRAL_CODE = generate.id();
const EMAIL = 'user@example.com';
const VENDORS = generate.array(2, generate.id);
const AMAZON_ACCOUNT = {
  token: generate.id(),
  vendors: VENDORS,
};
const GOOGLE_ACCOUNT = {
  token: generate.id(),
  profile: {
    email: EMAIL,
  },
};
const MOCK_STATE = {
  creator_id: CREATOR_ID,
  referrer_id: REFERRER_ID,
  referral_code: REFERRAL_CODE,
  email: EMAIL,
  amazon: AMAZON_ACCOUNT as any,
  google: GOOGLE_ACCOUNT as any,
  first_login: true,
} as Account.AccountState;

suite(Account, MOCK_STATE)('Ducks - Account', ({ expect, stub, describeReducer, describeSelectors, describeSideEffects }) => {
  describeReducer(({ expectAction }) => {
    describe('updateAccount()', () => {
      it('should replace the active account', () => {
        expectAction(Account.updateAccount(Fixtures.USER)).toModify(Fixtures.USER);
      });
    });

    describe('resetAccount()', () => {
      it('should reset all account information', () => {
        expectAction(Account.resetAccount()).result.to.eq(Account.INITIAL_STATE);
      });
    });

    describe('updateAmazonAccount()', () => {
      it('should update the existing amazon account', () => {
        const amazonAccount: any = { token: 'xyz' };

        expectAction(Account.updateAmazonAccount(amazonAccount)).toModify({
          amazon: {
            ...AMAZON_ACCOUNT,
            ...amazonAccount,
          },
        });
      });
    });

    it('should update the existing google account', () => {
      const googleAccount: any = { token: 'xyz' };

      expectAction(Account.updateGoogleAccount(googleAccount)).toModify({
        google: {
          ...GOOGLE_ACCOUNT,
          ...googleAccount,
        },
      });
    });
  });

  describeSelectors(({ select }) => {
    describe('userSelector()', () => {
      it('should select user', () => {
        expect(select(Account.userSelector)).to.eq(MOCK_STATE);
      });
    });

    describe('userIDSelector()', () => {
      it('should select user ID', () => {
        expect(select(Account.userIDSelector)).to.eq(CREATOR_ID);
      });
    });

    describe('referrerIDSelector()', () => {
      it('should select referrer ID', () => {
        expect(select(Account.referrerIDSelector)).to.eq(REFERRER_ID);
      });
    });

    describe('referralCodeSelector()', () => {
      it('should select referral code', () => {
        expect(select(Account.referralCodeSelector)).to.eq(REFERRAL_CODE);
      });
    });

    describe('isLoggingInSelector()', () => {
      it('should be logging in', () => {
        expect(
          select(Account.isLoggingInSelector, {
            [Session.STATE_KEY]: { token: { value: generate.id() } },
            [Account.STATE_KEY]: { creator_id: null },
          })
        ).to.be.true;
      });

      it('should not be logging in', () => {
        expect(select(Account.isLoggingInSelector, { [Session.STATE_KEY]: { token: { value: null } } })).to.be.false;
      });
    });

    describe('isLoggedInSelector()', () => {
      it('should be logged in', () => {
        expect(select(Account.isLoggedInSelector, { [Session.STATE_KEY]: { token: { value: generate.id() } } })).to.be.true;
      });

      it('should not be logged in', () => {
        expect(select(Account.isLoggedInSelector, { [Session.STATE_KEY]: { token: { value: null } } })).to.be.false;
      });
    });

    describe('isFirstLoginSelector()', () => {
      it('should select if is first login', () => {
        expect(select(Account.isFirstLoginSelector)).to.be.true;
      });
    });

    describe('userEmailSelector()', () => {
      it('should select user email', () => {
        expect(select(Account.userEmailSelector)).to.eq(EMAIL);
      });
    });

    describe('amazonAccountSelector()', () => {
      it('should select amazon account', () => {
        expect(select(Account.amazonAccountSelector)).to.eq(AMAZON_ACCOUNT);
      });
    });

    describe('amazonVendorsSelector()', () => {
      it('should select amazon account', () => {
        expect(select(Account.amazonVendorsSelector)).to.eq(VENDORS);
      });

      it('should select default', () => {
        expect(select(Account.amazonVendorsSelector, { [Account.STATE_KEY]: {} })).to.eql([]);
      });
    });

    describe('googleAccountSelector()', () => {
      it('should select google account', () => {
        expect(select(Account.googleAccountSelector)).to.eq(GOOGLE_ACCOUNT);
      });
    });

    describe('googleEmailSelector()', () => {
      it('should select google account email', () => {
        expect(select(Account.googleEmailSelector)).to.eq(EMAIL);
      });

      it('should select default', () => {
        expect(select(Account.googleEmailSelector, { [Account.STATE_KEY]: {} })).to.eq('0');
      });
    });
  });

  describe('alexa', () => {
    describeSideEffects(({ applyEffect }) => {
      describe('linkAccount()', () => {
        it('should link amazon account', async () => {
          const code = '!@#';
          const amazonAccount: any = { token: 'xyz' };
          const linkAccount = stub(client.platform.alexa.session, 'linkAccount').resolves(amazonAccount);

          const { expectDispatch } = await applyEffect(Account.amazon.linkAccount(code));

          expect(linkAccount).to.be.calledWith({ code });
          expectDispatch(Account.updateAccount({ amazon: amazonAccount }));
        });
      });

      describe('loadAccount()', () => {
        it('should update amazon account on success', async () => {
          const amazonAccount: any = { token: 'xyz' };
          const getAccount = stub(client.platform.alexa.session, 'getAccount').resolves(amazonAccount);

          const { expectDispatch } = await applyEffect(Account.amazon.loadAccount());

          expect(getAccount).to.be.calledWithExactly();
          expectDispatch(Account.updateAccount({ amazon: amazonAccount }));
        });

        it('should clear amazon account on failure', async () => {
          stub(client.platform.alexa.session, 'getAccount').rejects(new Error('mock error'));

          const { expectDispatch } = await applyEffect(Account.amazon.loadAccount());

          expectDispatch(Account.updateAccount({ amazon: null }));
        });
      });

      describe('unlinkAccount()', () => {
        it('should clear amazon account on success', async () => {
          const amazonAccount: any = { token: 'xyz' };
          const deleteAccount = stub(client.platform.alexa.session, 'unlinkAccount').resolves(amazonAccount);

          const { expectDispatch } = await applyEffect(Account.amazon.unlinkAccount());

          expect(deleteAccount).to.be.calledWithExactly();
          expectDispatch(Account.updateAccount({ amazon: null }));
        });

        it('should set an error on failure', async () => {
          const deleteAccount = stub(client.platform.alexa.session, 'unlinkAccount').rejects(new Error('mock error'));

          const { expectDispatch } = await applyEffect(Account.amazon.unlinkAccount());

          expect(deleteAccount).to.be.calledWithExactly();
          expectDispatch(Modal.setError('Something went wrong - please refresh your page'));
        });
      });
    });
  });

  describe('google', () => {
    describeSideEffects(({ applyEffect }) => {
      describe('linkAccount()', () => {
        it('should link google account', async () => {
          const code = '!@#';
          const googleAccount: any = { token: 'xyz' };
          const linkAccount = stub(client.platform.google.session, 'linkAccount').resolves(googleAccount);

          const { expectDispatch } = await applyEffect(Account.google.linkAccount(code));

          expect(linkAccount).to.be.calledWith({ code });
          expectDispatch(Account.updateAccount({ google: googleAccount }));
        });
      });

      describe('loadAccount()', () => {
        it('should update google account on success', async () => {
          const googleAccount: any = { token: 'xyz' };
          const getAccount = stub(client.platform.google.session, 'getAccount').resolves(googleAccount);

          const { expectDispatch } = await applyEffect(Account.google.loadAccount());

          expect(getAccount).to.be.calledWithExactly();
          expectDispatch(Account.updateAccount({ google: googleAccount }));
        });

        it('should clear google account on failure', async () => {
          stub(client.platform.google.session, 'getAccount').rejects(new Error('mock error'));

          const { expectDispatch } = await applyEffect(Account.google.loadAccount());

          expectDispatch(Account.updateAccount({ google: null }));
        });
      });

      describe('unlinkAccount()', () => {
        it('should clear google account on success', async () => {
          const googleAccount: any = { token: 'xyz' };
          const deleteAccount = stub(client.platform.google.session, 'unlinkAccount').resolves(googleAccount);

          const { expectDispatch } = await applyEffect(Account.google.unlinkAccount());

          expect(deleteAccount).to.be.calledWithExactly();
          expectDispatch(Account.updateAccount({ google: null }));
        });

        it('should set an error on failure', async () => {
          const deleteAccount = stub(client.platform.google.session, 'unlinkAccount').rejects(new Error('mock error'));

          const { expectDispatch } = await applyEffect(Account.google.unlinkAccount());

          expect(deleteAccount).to.be.calledWithExactly();
          expectDispatch(Modal.setError('Something went wrong - please refresh your page'));
        });
      });
    });
  });
});
