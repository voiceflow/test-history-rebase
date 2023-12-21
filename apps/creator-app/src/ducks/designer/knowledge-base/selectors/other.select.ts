import { createSelector } from 'reselect';

import { root } from './root.select';

export const settings = createSelector(root, (state) => state.settings);
