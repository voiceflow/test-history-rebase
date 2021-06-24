import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';

import account, * as Account from '@/ducks/accountV2';
import admin, * as Admin from '@/ducks/adminV2';
import modal, * as Modal from '@/ducks/modal';
import referral, * as Referral from '@/ducks/referral';

const getCombinedReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    [Admin.STATE_KEY]: admin,
    [Account.STATE_KEY]: account,
    [Referral.STATE_KEY]: referral,
    [Modal.STATE_KEY]: modal,
  });

export default getCombinedReducer;

export type State = ReturnType<ReturnType<typeof getCombinedReducer>>;
