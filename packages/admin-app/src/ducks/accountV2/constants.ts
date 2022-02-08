import { AccountState } from './types';

export const INITIAL_STATE: AccountState = {
  loading: false,
  email: null,
  name: null,
  id: null,
  internalAdmin: false,
  image: null,
  vendors: [],
};

export const STATE_KEY = 'accountV2';
