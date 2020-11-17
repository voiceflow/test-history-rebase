import update from 'immutability-helper';
import { createSelector } from 'reselect';

import { createAction } from '@/ducks/utils';

import { activeSkillSelector } from '../skill';

export const UPDATE_SKILL_META = 'SKILL:META:UPDATE';
export const UPDATE_SKILL_META_SETTINGS = 'SKILL:META:SETTINGS:UPDATE';

export const updateSkillMetaReducer = (state, { payload }) => update(state, { $merge: { ...payload } });
export const updateSkillMetaSettingsReducer = (state, { payload }) => update(state, { settings: { $merge: { ...payload } } });

function skillMetaReducer(state = null, action) {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case UPDATE_SKILL_META_SETTINGS:
      return updateSkillMetaSettingsReducer(state, action);
    case UPDATE_SKILL_META:
      return updateSkillMetaReducer(state, action);
    default:
      return state;
  }
}

export default skillMetaReducer;

export const updateSkillMeta = (properties, meta) => createAction(UPDATE_SKILL_META, { ...properties }, meta);

export const updateSettings = (payload) => createAction(UPDATE_SKILL_META_SETTINGS, payload);

// SELECTORS
export const skillMetaSelector = createSelector(activeSkillSelector, ({ meta }) => meta);

export const invNameSelector = createSelector(skillMetaSelector, ({ invName }) => invName);

export const settingsSelector = createSelector(skillMetaSelector, ({ settings }) => settings);

export const accountLinkingSelector = createSelector(skillMetaSelector, ({ accountLinking }) => accountLinking);

// ACTIONS

export const updateAccountLinking = (accountLinking) => updateSkillMeta({ accountLinking });
