import { createSelector } from 'reselect';

import { root } from './root.select';

export const settings = createSelector(root, (state) => state.settings);

export const getOneDocumentByName = createSelector(
  root,
  (state) => (name: string) => Object.values(state.document.byKey).find((d) => d.data?.name === name)
);
