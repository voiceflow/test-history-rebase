import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import account from '@/admin/store/ducks/account';
import admin from '@/admin/store/ducks/admin';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    admin,
    account,
  });
