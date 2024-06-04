import { Utils } from '@voiceflow/common';

import * as Fixtures from '@/../test/_fixtures';
import client from '@/client';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';

import suite from './_suite';

const CREATOR_ID = 123;
const EMAIL = 'user@example.com';
const VENDORS = Utils.generate.array(2, Utils.generate.id);
const AMAZON_ACCOUNT = {
  token: Utils.generate.id(),
  vendors: VENDORS,
};
const GOOGLE_ACCOUNT = {
  token: Utils.generate.id(),
  profile: {
    email: EMAIL,
  },
};
const MOCK_STATE = {
  creator_id: CREATOR_ID,
  email: EMAIL,
  amazon: AMAZON_ACCOUNT as any,
  google: GOOGLE_ACCOUNT as any,
  first_login: true,
} as Account.AccountState;

suite(Account, MOCK_STATE)('Ducks - Account', ({ describeReducer, describeSelectors, describeSideEffects }) => {
  describeReducer(({ expectAction }) => {
    describe('updateAccount()', () => {
      it('should replace the active account', () => {
        expectAction(Account.updateAccount(Fixtures.USER)).toModify(Fixtures.USER);
      });
    });

    describe('resetAccount()', () => {
      it('should reset all account information', () => {
        expectAction(Account.resetAccount()).result.toBe(Account.INITIAL_STATE);
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
        expect(select(Account.userSelector)).toBe(MOCK_STATE);
      });
    });

    describe('userIDSelector()', () => {
      it('should select user ID', () => {
        expect(select(Account.userIDSelector)).toBe(CREATOR_ID);
      });
    });

    describe('isLoggingInSelector()', () => {
      it('should be logging in', () => {
        expect(
          select(Account.isLoggingInSelector, {
            [Session.STATE_KEY]: { token: { value: Utils.generate.id() } },
            [Account.STATE_KEY]: { creator_id: null },
          })
        ).toBeTruthy();
      });

      it('should not be logging in', () => {
        expect(select(Account.isLoggingInSelector, { [Session.STATE_KEY]: { token: { value: null } } })).toBeFalsy();
      });
    });

    describe('isLoggedInSelector()', () => {
      it('should be logged in', () => {
        expect(
          select(Account.isLoggedInSelector, { [Session.STATE_KEY]: { token: { value: Utils.generate.id() } } })
        ).toBeTruthy();
      });

      it('should not be logged in', () => {
        expect(select(Account.isLoggedInSelector, { [Session.STATE_KEY]: { token: { value: null } } })).toBeFalsy();
      });
    });

    describe('userEmailSelector()', () => {
      it('should select user email', () => {
        expect(select(Account.userEmailSelector)).toBe(EMAIL);
      });
    });

    describe('amazonAccountSelector()', () => {
      it('should select amazon account', () => {
        expect(select(Account.amazonAccountSelector)).toBe(AMAZON_ACCOUNT);
      });
    });

    describe('amazonVendorsSelector()', () => {
      it('should select amazon account', () => {
        expect(select(Account.amazonVendorsSelector)).toBe(VENDORS);
      });

      it('should select default', () => {
        expect(select(Account.amazonVendorsSelector, { [Account.STATE_KEY]: {} })).toEqual([]);
      });
    });

    describe('googleAccountSelector()', () => {
      it('should select google account', () => {
        expect(select(Account.googleAccountSelector)).toBe(GOOGLE_ACCOUNT);
      });
    });

    describe('googleEmailSelector()', () => {
      it('should select google account email', () => {
        expect(select(Account.googleEmailSelector)).toBe(EMAIL);
      });

      it('should select default', () => {
        expect(select(Account.googleEmailSelector, { [Account.STATE_KEY]: {} })).toBe('0');
      });
    });
  });

  describe('alexa', () => {
    describeSideEffects(({ applyEffect }) => {
      describe('linkAccount()', () => {
        it('should link amazon account', async () => {
          const code = '!@#';
          const amazonAccount: any = { token: 'xyz' };
          const linkAccount = vi.spyOn(client.platform.alexa.session, 'linkAccount').mockResolvedValue(amazonAccount);

          const { expectDispatch } = await applyEffect(Account.amazon.linkAccount(code));

          expect(linkAccount).toBeCalledWith({ code });
          expectDispatch(Account.updateAccount({ amazon: amazonAccount }));
        });
      });

      describe('loadAccount()', () => {
        it('should update amazon account on success', async () => {
          const amazonAccount: any = { token: 'xyz' };
          const getAccount = vi.spyOn(client.platform.alexa.session, 'getAccount').mockResolvedValue(amazonAccount);

          const { expectDispatch } = await applyEffect(Account.amazon.loadAccount());

          expect(getAccount).toBeCalledWith();
          expectDispatch(Account.updateAccount({ amazon: amazonAccount }));
        });

        it('should clear amazon account on failure', async () => {
          vi.spyOn(client.platform.alexa.session, 'getAccount').mockRejectedValue(new Error('mock error'));

          const { expectDispatch } = await applyEffect(Account.amazon.loadAccount());

          expectDispatch(Account.updateAccount({ amazon: null }));
        });
      });

      describe('unlinkAccount()', () => {
        it('should clear amazon account on success', async () => {
          const amazonAccount: any = { token: 'xyz' };
          const deleteAccount = vi
            .spyOn(client.platform.alexa.session, 'unlinkAccount')
            .mockResolvedValue(amazonAccount);

          const { expectDispatch } = await applyEffect(Account.amazon.unlinkAccount());

          expect(deleteAccount).toBeCalledWith();
          expectDispatch(Account.updateAccount({ amazon: null }));
        });

        it('should set an error on failure', async () => {
          const deleteAccount = vi
            .spyOn(client.platform.alexa.session, 'unlinkAccount')
            .mockRejectedValue(new Error('mock error'));

          await applyEffect(Account.amazon.unlinkAccount());

          expect(deleteAccount).toBeCalledWith();
        });
      });
    });
  });
});
