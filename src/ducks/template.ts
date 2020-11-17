import { Template } from '@/models';

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
