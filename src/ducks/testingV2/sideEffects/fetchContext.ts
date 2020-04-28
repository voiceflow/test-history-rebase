import cuid from 'cuid';

import client from '@/client';
import { activeLocalesSelector } from '@/ducks/skill';
import { Thunk } from '@/store/types';

import { updateTestingContext } from '../actions';
import { testingContextSelector } from '../selectors';
import { Context } from '../types';

const fetchContext = (request?: any): Thunk<Context | null> => async (dispatch, getState) => {
  const state = getState();
  const { trace, ...context } = testingContextSelector(state);
  const [locale] = activeLocalesSelector(state);

  try {
    const newContext = (await client.testingV2.interact({ state: context, request }, locale)) as Context;

    dispatch(updateTestingContext(newContext));

    return {
      ...newContext,
      trace: newContext.trace?.map((trace) => ({ id: cuid(), ...trace })) ?? [],
    };
  } catch (err) {
    console.error(err);

    return null;
  }
};

export default fetchContext;
