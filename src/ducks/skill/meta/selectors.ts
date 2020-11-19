import { createSelector } from 'reselect';

import { activeSkillSelector } from '../skill';

export const skillMetaSelector = createSelector(activeSkillSelector, ({ meta }) => meta);

export const invNameSelector = createSelector(skillMetaSelector, ({ invName }) => invName);

export const settingsSelector = createSelector(skillMetaSelector, ({ settings }) => settings);

export const accountLinkingSelector = createSelector(skillMetaSelector, ({ accountLinking }) => accountLinking);
