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

suite('Ducks - Account', ({ expect, stub, describeReducer, describeSelectors, describeSideEffects }) => {
  describeReducer(Account, MOCK_STATE, (utils) => {
    describe('updateAccount()', () => {
      it('should replace the active account', () => {
        utils.expectDiff(Account.updateAccount(Fixtures.USER), Fixtures.USER);
      });
    });

    describe('updateAmazonAccount()', () => {
      it('should update the existing amazon account', () => {
        utils.expectDiff(Account.updateAmazonAccount(Fixtures.USER), {
          amazon: {
            ...AMAZON_ACCOUNT,
            ...Fixtures.USER,
          },
        });
      });
    });

    it('should update the existing google account', () => {
      utils.expectDiff(Account.updateGoogleAccount(Fixtures.USER), {
        google: {
          ...GOOGLE_ACCOUNT,
          ...Fixtures.USER,
        },
      });
    });
  });

  describeSelectors(Account, MOCK_STATE, (utils) => {
    describe('userSelector()', () => {
      it('should select user', () => {
        utils.select(Account.userSelector, MOCK_STATE);
      });
    });

    describe('userIDSelector()', () => {
      it('should select user ID', () => {
        utils.select(Account.userIDSelector, CREATOR_ID);
      });
    });

    describe('amazonAccountSelector()', () => {
      it('should select amazon account', () => {
        utils.select(Account.amazonAccountSelector, AMAZON_ACCOUNT);
      });
    });
  });

  describeSideEffects({ [Account.STATE_KEY]: MOCK_STATE }, (utils) => {
    describe('getVendors()', () => {
      it('should be a noop if no amazon account available', async () => {
        const { dispatch } = await utils.applyEffect(Account.getVendors(), { [Account.STATE_KEY]: {} });

        expect(dispatch).to.not.be.called;
      });

      it('should store array of vendors', async () => {
        const vendors = ['a', 'b', 'c'];
        const getVendors = stub(client.user, 'getVendors').returns(vendors);

        const { dispatch } = await utils.applyEffect(Account.getVendors());

        expect(getVendors).to.be.calledWithExactly();
        expect(dispatch).to.be.calledWithExactly(Account.updateAmazonAccount({ vendors }));
      });
    });

    describe('createAmazonSession()', () => {
      it('should link amazon account', async () => {
        const code = '!@#';
        const amazonAccount = { token: 'xyz' };
        const linkAccount = stub(client.session.amazon, 'linkAccount').returns(amazonAccount);

        const { dispatch } = await utils.applyEffect(Account.createAmazonSession(code));

        expect(linkAccount).to.be.calledWithExactly(code);
        expect(dispatch).to.be.calledWithExactly(Account.updateAccount({ amazon: amazonAccount }));
      });
    });

    describe('checkAmazonAccount()', () => {
      it('should update amazon account on success', async () => {
        const amazonAccount = { token: 'xyz' };
        const getAccount = stub(client.session.amazon, 'getAccount').returns(amazonAccount);

        const { dispatch } = await utils.applyEffect(Account.checkAmazonAccount());

        expect(getAccount).to.be.calledWithExactly();
        expect(dispatch).to.be.calledWithExactly(Account.updateAccount({ amazon: amazonAccount }));
      });

      it('should clear amazon account on failure', async () => {
        stub(client.session.amazon, 'getAccount').throws(new Error('mock error'));

        const { dispatch } = await utils.applyEffect(Account.checkAmazonAccount());

        expect(dispatch).to.be.calledWithExactly(Account.updateAccount({ amazon: null }));
      });
    });

    describe('deleteAmazonAccount()', () => {
      it('should clear amazon account on success', async () => {
        const amazonAccount = { token: 'xyz' };
        const deleteAccount = stub(client.session.amazon, 'deleteAccount').returns(amazonAccount);

        const { dispatch } = await utils.applyEffect(Account.deleteAmazonAccount());

        expect(deleteAccount).to.be.calledWithExactly();
        expect(dispatch).to.be.calledWithExactly(Account.updateAccount({ amazon: null }));
      });

      it('should set an error on failure', async () => {
        const deleteAccount = stub(client.session.amazon, 'deleteAccount').throws(new Error('mock error'));

        const { dispatch } = await utils.applyEffect(Account.deleteAmazonAccount());

        expect(deleteAccount).to.be.calledWithExactly();
        expect(dispatch).to.be.calledWithExactly(Modal.setError('Something went wrong - please refresh your page'));
      });
    });

    describe('createGoogleSession()', () => {
      it('should link google account', async () => {
        const code = '!@#';
        const googleAccount = { token: 'xyz' };
        const linkAccount = stub(client.session.google, 'linkAccount').returns(googleAccount);

        const { dispatch } = await utils.applyEffect(Account.createGoogleSession(code));

        expect(linkAccount).to.be.calledWithExactly(code);
        expect(dispatch).to.be.calledWithExactly(Account.updateAccount({ google: googleAccount }));
      });
    });

    describe('checkGoogleAccount()', () => {
      it('should update google account on success', async () => {
        const googleAccount = { token: 'xyz' };
        const getAccount = stub(client.session.google, 'getAccount').returns(googleAccount);

        const { dispatch } = await utils.applyEffect(Account.checkGoogleAccount());

        expect(getAccount).to.be.calledWithExactly();
        expect(dispatch).to.be.calledWithExactly(Account.updateAccount({ google: googleAccount }));
      });

      it('should clear google account on failure', async () => {
        stub(client.session.google, 'getAccount').throws(new Error('mock error'));

        const { dispatch } = await utils.applyEffect(Account.checkGoogleAccount());

        expect(dispatch).to.be.calledWithExactly(Account.updateAccount({ google: null }));
      });
    });

    describe('deleteGoogleAccount()', () => {
      it('should clear google account on success', async () => {
        const googleAccount = { token: 'xyz' };
        const deleteAccount = stub(client.session.google, 'deleteAccount').returns(googleAccount);

        const { dispatch } = await utils.applyEffect(Account.deleteGoogleAccount());

        expect(deleteAccount).to.be.calledWithExactly();
        expect(dispatch).to.be.calledWithExactly(Account.updateAccount({ google: null }));
      });

      it('should set an error on failure', async () => {
        const deleteAccount = stub(client.session.google, 'deleteAccount').throws(() => new Error('mock error'));

        const { dispatch } = await utils.applyEffect(Account.deleteGoogleAccount());

        expect(deleteAccount).to.be.calledWithExactly();
        expect(dispatch).to.be.calledWithExactly(Modal.setError('Something went wrong - please refresh your page'));
      });
    });
  });
});
