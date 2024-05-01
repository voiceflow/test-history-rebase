import { Utils } from '@voiceflow/common';
import { describe, expect, it, vi } from 'vitest';

import client from '@/client';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';

import { createDuckTools } from '../_suite';

const USER = {
  name: 'Anonymous User',
  email: 'test@voiceflow.com',
  creatorID: '123',
};
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

const { createState, describeSelectors, describeReducer, describeEffect } = createDuckTools(Account, MOCK_STATE);

describe('Ducks - Account', () => {
  describeReducer(Account.updateAccount, ({ applyAction }) => {
    it('should replace the active account', () => {
      const result = applyAction(MOCK_STATE, USER);

      expect(result).toEqual(USER);
    });
  });

  describeReducer(Account.resetAccount, ({ applyAction }) => {
    it('should reset all account information', () => {
      const result = applyAction(MOCK_STATE);

      expect(result).toEqual(Account.INITIAL_STATE);
    });
  });

  describeReducer(Account.updateAmazonAccount, ({ applyAction }) => {
    it('should update the existing amazon account', () => {
      const amazonAccount: any = { token: 'xyz' };

      const result = applyAction(MOCK_STATE, amazonAccount);

      expect(result.amazon).toEqual({ ...AMAZON_ACCOUNT, ...amazonAccount });
    });
  });

  describeReducer(Account.updateGoogleAccount, ({ applyAction }) => {
    it('should update the existing amazon account', () => {
      const amazonAccount: any = { token: 'xyz' };

      const result = applyAction(MOCK_STATE, amazonAccount);

      expect(result.amazon).toEqual({ ...AMAZON_ACCOUNT, ...amazonAccount });
    });

    it('should update the existing google account', () => {
      const googleAccount: any = { token: 'xyz' };

      const result = applyAction(MOCK_STATE, googleAccount);

      expect(result.google).toEqual({ ...GOOGLE_ACCOUNT, ...googleAccount });
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

    describe('isFirstLoginSelector()', () => {
      it('should select if is first login', () => {
        expect(select(Account.isFirstLoginSelector)).toBeTruthy();
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
    describeEffect(Account.amazon.linkAccount, 'linkAccount()', ({ applyEffect }) => {
      it('should link amazon account', async () => {
        const code = '!@#';
        const amazonAccount: any = { token: 'xyz' };
        const linkAccount = vi.spyOn(client.platform.alexa.session, 'linkAccount').mockResolvedValue(amazonAccount);

        const { dispatched } = await applyEffect(createState(MOCK_STATE), code);

        expect(linkAccount).toBeCalledWith({ code });
        expect(dispatched).toEqual([Account.updateAccount({ amazon: amazonAccount })]);
      });
    });

    describeEffect(Account.amazon.loadAccount, 'loadAccount()', ({ applyEffect }) => {
      it('should update amazon account on success', async () => {
        const amazonAccount: any = { token: 'xyz' };
        const getAccount = vi.spyOn(client.platform.alexa.session, 'getAccount').mockResolvedValue(amazonAccount);

        const { dispatched } = await applyEffect(createState(MOCK_STATE));

        expect(getAccount).toBeCalledWith();
        expect(dispatched).toEqual([Account.updateAccount({ amazon: amazonAccount })]);
      });

      it('should clear amazon account on failure', async () => {
        vi.spyOn(client.platform.alexa.session, 'getAccount').mockRejectedValue(new Error('mock error'));

        const { dispatched } = await applyEffect(createState(MOCK_STATE));

        expect(dispatched).toEqual([Account.updateAccount({ amazon: null })]);
      });
    });

    describeEffect(Account.amazon.unlinkAccount, 'unlinkAccount()', ({ applyEffect }) => {
      it('should clear amazon account on success', async () => {
        const amazonAccount: any = { token: 'xyz' };
        const deleteAccount = vi.spyOn(client.platform.alexa.session, 'unlinkAccount').mockResolvedValue(amazonAccount);

        const { dispatched } = await applyEffect(createState(MOCK_STATE));

        expect(deleteAccount).toBeCalledWith();
        expect(dispatched).toEqual([Account.updateAccount({ amazon: null })]);
      });

      it('should set an error on failure', async () => {
        const deleteAccount = vi
          .spyOn(client.platform.alexa.session, 'unlinkAccount')
          .mockRejectedValue(new Error('mock error'));

        await applyEffect(createState(MOCK_STATE));

        expect(deleteAccount).toBeCalledWith();
      });
    });
  });
});
