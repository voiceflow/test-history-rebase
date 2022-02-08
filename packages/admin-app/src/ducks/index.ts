import { combineReducers } from 'redux';

import account, * as Account from '@/ducks/accountV2';
import admin, * as Admin from '@/ducks/adminV2';
import modal, * as Modal from '@/ducks/modal';
import referral, * as Referral from '@/ducks/referral';
import { routerReducer } from '@/store/reduxHistory';

const rootReducer = combineReducers({
  router: routerReducer,
  [Modal.STATE_KEY]: modal,
  [Admin.STATE_KEY]: admin,
  [Account.STATE_KEY]: account,
  [Referral.STATE_KEY]: referral,
});

export default rootReducer;

export type State = ReturnType<typeof rootReducer>;
