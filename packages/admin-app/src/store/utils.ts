import moize from 'moize';
import Cookies from 'universal-cookie';

import type { State } from './types';

export const createRootSelector = <K extends keyof State>(stateKey: K): ((state: State) => State[K]) => moize(({ [stateKey]: state }) => state);

export const getUserInfoType = (user: string) => {
  if (Number.isNaN(parseInt(user, 10))) {
    return { email: user, userID: null };
  }

  return { email: null, userID: parseInt(user, 10) };
};

export const cookies = new Cookies();
