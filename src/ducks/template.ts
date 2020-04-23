import client from '@/client';
import { Template } from '@/models';
import { Thunk } from '@/store/types';

import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';

export const STATE_KEY = 'template';

const templateReducer = createCRUDReducer<Template>(STATE_KEY);

export default templateReducer;

// selectors

export const { root: rootTemplatesSelector, all: allTemplatesSelector, byID: templateByIDSelector, has: hasTemplatesSelector } = createCRUDSelectors<
  Template
>(STATE_KEY);

// action creators

export const { replace: replaceTemplates } = createCRUDActionCreators<Template>(STATE_KEY);

// side effects

export const loadTemplates = (): Thunk<Template[] | void> => async (dispatch, getState) => {
  if (hasTemplatesSelector(getState())) {
    return;
  }

  try {
    const templates = await client.template.find();

    if (Array.isArray(templates)) {
      dispatch(replaceTemplates(templates));

      return templates;
    }

    throw new Error('Malformed Response');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.response);

    throw err;
  }
};
