import update from 'immutability-helper';
import { createSelector } from 'reselect';

import client from '@/client';
import skillMetaAdapter from '@/client/adapters/skill/meta';
import { createAction } from '@/ducks/utils';

import { activeProjectIDSelector, activeSkillIDSelector, activeSkillSelector } from '../skill';

export const UPDATE_SKILL_META = 'SKILL:META:UPDATE';

export const updateSkillMetaReducer = (state, { payload }) => update(state, { $merge: { ...payload } });

function skillMetaReducer(state = null, action) {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case UPDATE_SKILL_META:
      return updateSkillMetaReducer(state, action);
    default:
      return state;
  }
}

export default skillMetaReducer;

export const updateSkillMeta = (properties) => createAction(UPDATE_SKILL_META, { ...properties });

// SELECTORS
export const skillMetaSelector = createSelector(
  activeSkillSelector,
  ({ meta }) => meta
);

export const invNameSelector = createSelector(
  skillMetaSelector,
  ({ invName }) => invName
);

export const accountLinkingSelector = createSelector(
  skillMetaSelector,
  ({ accountLinking }) => accountLinking
);

// ACTIONS
export const updateInvName = (invName) => async (dispatch, getState) => {
  const skillId = activeSkillIDSelector(getState());

  await client.skill.updateInvName(skillId, invName);
  dispatch(updateSkillMeta({ invName }));
};

export const updateAccountLinking = (accountLinking) => updateSkillMeta({ accountLinking });

export const getImportToken = () => async (dispatch, getState) => {
  const state = getState();
  let { importToken } = skillMetaSelector(state);

  if (!importToken) {
    const projectID = activeProjectIDSelector(state);
    importToken = await client.project.getImportToken(projectID);

    dispatch(updateSkillMeta({ importToken }));
  }
};

export const saveMetaSettings = (settings) => async (dispatch, getState) => {
  const state = getState();
  const skillID = activeSkillIDSelector(state);

  await client.skill.update(skillID, skillMetaAdapter.toDB(settings));
  dispatch(updateSkillMeta(settings));
};
