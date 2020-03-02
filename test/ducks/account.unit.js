import client from '@/client';
import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import { Fixtures } from '@/utils/testing';

import suite from './_suite';

const CREATOR_ID = '123';
const AMAZON_ACCOUNT = {
  token: 'abc',
};
const GOOGLE_ACCOUNT = {
  token: 'def',
};
const MOCK_STATE = {
  creator_id: CREATOR_ID,
  amazon: AMAZON_ACCOUNT,
  google: GOOGLE_ACCOUNT,
};

suite(Account, MOCK_STATE)('Ducks - Account', ({ expect, stub, describeReducer, describeSelectors, describeSideEffects }) => {
  describeReducer(({ expectAction }) => {
    describe('updateAccount()', () => {
      it('should replace the active account', () => {
        expectAction(Account.updateAccount(Fixtures.USER)).toModify(Fixtures.USER);
      });
    });

    describe('updateAmazonAccount()', () => {
      it('should update the existing amazon account', () => {
        expectAction(Account.updateAmazonAccount(Fixtures.USER)).toModify({
          amazon: {
            ...AMAZON_ACCOUNT,
            ...Fixtures.USER,
          },
        });
      });
    });

    it('should update the existing google account', () => {
      expectAction(Account.updateGoogleAccount(Fixtures.USER)).toModify({
        google: {
          ...GOOGLE_ACCOUNT,
          ...Fixtures.USER,
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

  describeSideEffects(({ applyEffect, createState }) => {
    describe('getVendors()', () => {
      it('should be a noop if no amazon account available', async () => {
        const { dispatch } = await applyEffect(Account.getVendors(), createState({}));

        expect(dispatch).to.not.be.called;
      });

      it('should store array of vendors', async () => {
        const vendors = ['a', 'b', 'c'];
        const getVendors = stub(client.user, 'getVendors').returns(vendors);

        const { expectDispatch } = await applyEffect(Account.getVendors());

        expect(getVendors).to.be.calledWithExactly();
        expectDispatch(Account.updateAmazonAccount({ vendors }));
      });
    });

    describe('createAmazonSession()', () => {
      it('should link amazon account', async () => {
        const code = '!@#';
        const amazonAccount = { token: 'xyz' };
        const linkAccount = stub(client.session.amazon, 'linkAccount').returns(amazonAccount);

        const { expectDispatch } = await applyEffect(Account.createAmazonSession(code));

        expect(linkAccount).to.be.calledWithExactly(code);
        expectDispatch(Account.updateAccount({ amazon: amazonAccount }));
      });
    });

    describe('checkAmazonAccount()', () => {
      it('should update amazon account on success', async () => {
        const amazonAccount = { token: 'xyz' };
        const getAccount = stub(client.session.amazon, 'getAccount').returns(amazonAccount);

        const { expectDispatch } = await applyEffect(Account.checkAmazonAccount());

        expect(getAccount).to.be.calledWithExactly();
        expectDispatch(Account.updateAccount({ amazon: amazonAccount }));
      });

      it('should clear amazon account on failure', async () => {
        stub(client.session.amazon, 'getAccount').throws(new Error('mock error'));

        const { expectDispatch } = await applyEffect(Account.checkAmazonAccount());

        expectDispatch(Account.updateAccount({ amazon: null }));
      });
    });

    describe('deleteAmazonAccount()', () => {
      it('should clear amazon account on success', async () => {
        const amazonAccount = { token: 'xyz' };
        const deleteAccount = stub(client.session.amazon, 'deleteAccount').returns(amazonAccount);

        const { expectDispatch } = await applyEffect(Account.deleteAmazonAccount());

        expect(deleteAccount).to.be.calledWithExactly();
        expectDispatch(Account.updateAccount({ amazon: null }));
      });

      it('should set an error on failure', async () => {
        const deleteAccount = stub(client.session.amazon, 'deleteAccount').throws(new Error('mock error'));

        const { expectDispatch } = await applyEffect(Account.deleteAmazonAccount());

        expect(deleteAccount).to.be.calledWithExactly();
        expectDispatch(Modal.setError('Something went wrong - please refresh your page'));
      });
    });

    describe('createGoogleSession()', () => {
      it('should link google account', async () => {
        const code = '!@#';
        const googleAccount = { token: 'xyz' };
        const linkAccount = stub(client.session.google, 'linkAccount').returns(googleAccount);

        const { expectDispatch } = await applyEffect(Account.createGoogleSession(code));

        expect(linkAccount).to.be.calledWithExactly(code);
        expectDispatch(Account.updateAccount({ google: googleAccount }));
      });
    });

    describe('checkGoogleAccount()', () => {
      it('should update google account on success', async () => {
        const googleAccount = { token: 'xyz' };
        const getAccount = stub(client.session.google, 'getAccount').returns(googleAccount);

        const { expectDispatch } = await applyEffect(Account.checkGoogleAccount());

        expect(getAccount).to.be.calledWithExactly();
        expectDispatch(Account.updateAccount({ google: googleAccount }));
      });

      it('should clear google account on failure', async () => {
        stub(client.session.google, 'getAccount').throws(new Error('mock error'));

        const { expectDispatch } = await applyEffect(Account.checkGoogleAccount());

        expectDispatch(Account.updateAccount({ google: null }));
      });
    });

    describe('deleteGoogleAccount()', () => {
      it('should clear google account on success', async () => {
        const googleAccount = { token: 'xyz' };
        const deleteAccount = stub(client.session.google, 'deleteAccount').returns(googleAccount);

        const { expectDispatch } = await applyEffect(Account.deleteGoogleAccount());

        expect(deleteAccount).to.be.calledWithExactly();
        expectDispatch(Account.updateAccount({ google: null }));
      });

      it('should set an error on failure', async () => {
        const deleteAccount = stub(client.session.google, 'deleteAccount').throws(() => new Error('mock error'));

        const { expectDispatch } = await applyEffect(Account.deleteGoogleAccount());

        expect(deleteAccount).to.be.calledWithExactly();
        expectDispatch(Modal.setError('Something went wrong - please refresh your page'));
      });
    });
  });
});
