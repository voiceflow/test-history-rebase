import client from '@/clientV2';
import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import { Fixtures } from '@/utils/testing';

import suite from './_suite';

const CREATOR_ID = 123;
const AMAZON_ACCOUNT: any = {
  token: 'abc',
};
const GOOGLE_ACCOUNT: any = {
  token: 'def',
};
const MOCK_STATE = {
  creator_id: CREATOR_ID,
  amazon: AMAZON_ACCOUNT,
  google: GOOGLE_ACCOUNT,
} as Account.AccountState;

suite(Account, MOCK_STATE)('Ducks - Account', ({ expect, stub, describeReducer, describeSelectors, describeSideEffects }) => {
  describeReducer(({ expectAction }) => {
    describe('updateAccount()', () => {
      it('should replace the active account', () => {
        expectAction(Account.updateAccount(Fixtures.USER)).toModify(Fixtures.USER);
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

    describe('amazonAccountSelector()', () => {
      it('should select amazon account', () => {
        expect(select(Account.amazonAccountSelector)).to.eq(AMAZON_ACCOUNT);
      });
    });
  });

  describeSideEffects(({ applyEffect }) => {
    describe('linkAmazonAccount()', () => {
      it('should link amazon account', async () => {
        const code = '!@#';
        const amazonAccount: any = { token: 'xyz' };
        const linkAccount = stub(client.alexaService.session, 'linkAccount').resolves(amazonAccount);

        const { expectDispatch } = await applyEffect(Account.linkAmazonAccount(code));

        expect(linkAccount).to.be.calledWith({ code });
        expectDispatch(Account.updateAccount({ amazon: amazonAccount }));
      });
    });

    describe('getAmazonAccount()', () => {
      it('should update amazon account on success', async () => {
        const amazonAccount: any = { token: 'xyz' };
        const getAccount = stub(client.alexaService.session, 'getAccount').resolves(amazonAccount);

        const { expectDispatch } = await applyEffect(Account.getAmazonAccount());

        expect(getAccount).to.be.calledWithExactly();
        expectDispatch(Account.updateAccount({ amazon: amazonAccount }));
      });

      it('should clear amazon account on failure', async () => {
        stub(client.alexaService.session, 'getAccount').throws(new Error('mock error'));

        const { expectDispatch } = await applyEffect(Account.getAmazonAccount());

        expectDispatch(Account.updateAccount({ amazon: null }));
      });
    });

    describe('unlinkAmazonAccount()', () => {
      it('should clear amazon account on success', async () => {
        const amazonAccount: any = { token: 'xyz' };
        const deleteAccount = stub(client.alexaService.session, 'unlinkAccount').resolves(amazonAccount);

        const { expectDispatch } = await applyEffect(Account.unlinkAmazonAccount());

        expect(deleteAccount).to.be.calledWithExactly();
        expectDispatch(Account.updateAccount({ amazon: null }));
      });

      it('should set an error on failure', async () => {
        const deleteAccount = stub(client.alexaService.session, 'unlinkAccount').throws(new Error('mock error'));

        const { expectDispatch } = await applyEffect(Account.unlinkAmazonAccount());

        expect(deleteAccount).to.be.calledWithExactly();
        expectDispatch(Modal.setError('Something went wrong - please refresh your page'));
      });
    });

    describe('linkGoogleAccount()', () => {
      it('should link google account', async () => {
        const code = '!@#';
        const googleAccount: any = { token: 'xyz' };
        const linkAccount = stub(client.googleService.session, 'linkAccount').returns(googleAccount);

        const { expectDispatch } = await applyEffect(Account.linkGoogleAccount(code));

        expect(linkAccount).to.be.calledWith({ code });
        expectDispatch(Account.updateAccount({ google: googleAccount }));
      });
    });

    describe('getGoogleAccount()', () => {
      it('should update google account on success', async () => {
        const googleAccount: any = { token: 'xyz' };
        const getAccount = stub(client.googleService.session, 'getAccount').returns(googleAccount);

        const { expectDispatch } = await applyEffect(Account.getGoogleAccount());

        expect(getAccount).to.be.calledWithExactly();
        expectDispatch(Account.updateAccount({ google: googleAccount }));
      });

      it('should clear google account on failure', async () => {
        stub(client.googleService.session, 'getAccount').throws(new Error('mock error'));

        const { expectDispatch } = await applyEffect(Account.getGoogleAccount());

        expectDispatch(Account.updateAccount({ google: null }));
      });
    });

    describe('unlinkGoogleAccount()', () => {
      it('should clear google account on success', async () => {
        const googleAccount: any = { token: 'xyz' };
        const deleteAccount = stub(client.googleService.session, 'unlinkAccount').returns(googleAccount);

        const { expectDispatch } = await applyEffect(Account.unlinkGoogleAccount());

        expect(deleteAccount).to.be.calledWithExactly();
        expectDispatch(Account.updateAccount({ google: null }));
      });

      it('should set an error on failure', async () => {
        const deleteAccount = stub(client.googleService.session, 'unlinkAccount').throws(() => new Error('mock error'));

        const { expectDispatch } = await applyEffect(Account.unlinkGoogleAccount());

        expect(deleteAccount).to.be.calledWithExactly();
        expectDispatch(Modal.setError('Something went wrong - please refresh your page'));
      });
    });
  });
});
