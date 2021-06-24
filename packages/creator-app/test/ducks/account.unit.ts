import * as Fixtures from '@/../test/_fixtures';
import client from '@/client';
import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';

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
