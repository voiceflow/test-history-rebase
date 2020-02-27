import client from '@/client';

import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';

export const STATE_KEY = 'template';

const templateReducer = createCRUDReducer(STATE_KEY);

export default templateReducer;

// selectors

export const { root: rootTemplatesSelector, all: allTemplatesSelector, byID: templateByIDSelector, has: hasTemplatesSelector } = createCRUDSelectors(
  STATE_KEY
);

// action creators

export const { replace: replaceTemplates } = createCRUDActionCreators(STATE_KEY);

// side effects

export const loadTemplates = () => async (dispatch, getState) => {
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
