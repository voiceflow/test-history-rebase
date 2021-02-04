/* eslint-disable import/prefer-default-export */
import { AccountState } from './types';

export const INITIAL_STATE: AccountState = {
  loading: false,
  email: null,
  name: null,
  creator_id: null,
  admin: 0,
  image: null,
  vendors: [],
};

export const STATE_KEY = 'accountV2';
