import cuid from 'cuid';

import client from '@/client';
import { activeLocalesSelector } from '@/ducks/skill';
import { Thunk } from '@/store/types';

import { updatePrototypeContext } from '../actions';
import { prototypeContextSelector } from '../selectors';
import { Context } from '../types';
import { log } from '../utils';

const fetchContext = (request?: any): Thunk<Context | null> => async (dispatch, getState) => {
  const state = getState();
  const { trace, ...context } = prototypeContextSelector(state);
  const [locale] = activeLocalesSelector(state);

  try {
    const newContext = (await client.prototype.interact({ state: context, request }, locale)) as Context;

    dispatch(updatePrototypeContext(newContext));

    return {
      ...newContext,
      trace: newContext.trace?.map((trace) => ({ id: cuid(), ...trace })) ?? [],
    };
  } catch (err) {
    log.error(err);

    return null;
  }
};

export default fetchContext;
