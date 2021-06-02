import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import account, * as Account from '@/admin/store/ducks/accountV2';
import admin, * as Admin from '@/admin/store/ducks/adminV2';
import referral, * as Referral from '@/admin/store/ducks/referral';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    [Admin.STATE_KEY]: admin,
    [Account.STATE_KEY]: account,
    [Referral.STATE_KEY]: referral,
  });
