import { constants } from '@voiceflow/common';
import { createSelector } from 'reselect';

import client from '@/client';
import intentAdapter from '@/client/adapters/intent';
import slotAdapter from '@/client/adapters/slot';
import { VALID_VARIABLE_NAME } from '@/constants';
import { allIntentsSelector } from '@/ducks/intent';
import { allSlotsSelector } from '@/ducks/slot';
import { createAction, createRootSelector } from '@/ducks/utils';
import { withoutValue } from '@/utils/array';

const { LOCALES } = constants.locales;

export const STATE_KEY = 'skill';

// actions

export const SET_ACTIVE_SKILL = 'SKILL:SET_ACTIVE';
export const SET_ACTIVE_PLATFORM = 'SKILL:SET_ACTIVE_PLATFORM';
export const UPDATE_ACTIVE_SKILL = 'SKILL:UPDATE_ACTIVE';
export const UPDATE_DIAGRAM_ID = 'SKILL:UPDATE_DIAGRAM_ID';
export const ADD_GLOBAL_VARIABLE = 'SKILL:GLOBAL_VARIABLE:ADD';
export const REPLACE_GLOBAL_VARIABLES = 'SKILL:GLOBAL_VARIABLES:REPLACE';
export const REMOVE_GLOBAL_VARIABLE = 'SKILL:GLOBAL_VARIABLE:REMOVE';

// reducers

export const setActiveSkillReducer = ({ payload: { skill, diagramID } }) => ({
  ...skill,
  diagramID: diagramID || skill.diagramID,
});

export const updateActiveSkillReducer = (state, { payload }) => ({
  ...state,
  ...payload,
});

export const updateDiagramIDReducer = (state, { payload: diagramID }) => ({
  ...state,
  diagramID,
});

export const addGlobalVariableReducer = (state, { payload: variable }) => ({
  ...state,
  globalVariables: [...state.globalVariables, variable],
});

export const removeGlobalVariableReducer = (state, { payload: variable }) => ({
  ...state,
  globalVariables: withoutValue(state.globalVariables, variable),
});

export const replaceGlobalVariablesReducer = (state, { payload: variables }) => ({
  ...state,
  globalVariables: variables,
});

function skillReducer(state = {}, action) {
  switch (action.type) {
    case SET_ACTIVE_SKILL:
      return setActiveSkillReducer(action);
    case UPDATE_ACTIVE_SKILL:
      return updateActiveSkillReducer(state, action);
    case UPDATE_DIAGRAM_ID:
      return updateDiagramIDReducer(state, action);
    case ADD_GLOBAL_VARIABLE:
      return addGlobalVariableReducer(state, action);
    case REMOVE_GLOBAL_VARIABLE:
      return removeGlobalVariableReducer(state, action);
    case REPLACE_GLOBAL_VARIABLES:
      return replaceGlobalVariablesReducer(state, action);
    default:
      return state;
  }
}

export default skillReducer;

// selectors

export const activeSkillSelector = createRootSelector(STATE_KEY);

export const activeSkillIDSelector = createSelector(
  activeSkillSelector,
  ({ id }) => id
);

export const activeNameSelector = createSelector(
  activeSkillSelector,
  ({ name }) => name
);

export const activeSkillVendorSelector = createSelector(
  activeSkillSelector,
  ({ vendor_id: vendorId }) => vendorId
);

export const activePlatformSelector = createSelector(
  activeSkillSelector,
  ({ platform }) => platform
);

export const activeDiagramIDSelector = createSelector(
  activeSkillSelector,
  ({ diagramID }) => diagramID
);

export const rootDiagramIDSelector = createSelector(
  activeSkillSelector,
  ({ rootDiagramID }) => rootDiagramID
);

export const globalVariablesSelector = createSelector(
  activeSkillSelector,
  (skill) => skill?.globalVariables || []
);

export const activeProjectIDSelector = createSelector(
  activeSkillSelector,
  ({ projectID }) => projectID
);

export const activeSkillCreatorIDSelector = createSelector(
  activeSkillSelector,
  ({ creatorID }) => creatorID
);

export const activeLocalesSelector = createSelector(
  activeSkillSelector,
  ({ locales }) => locales
);

export const activeSkillMetaSelector = createSelector(
  activeSkillSelector,
  ({ meta }) => meta
);

export const parentCtrlSelector = createSelector(
  activeLocalesSelector,
  activeSkillMetaSelector,
  (locales, meta) => meta.copa && locales.includes(LOCALES.US)
);

export const isLiveSelector = createSelector(
  activeSkillSelector,
  // eslint-disable-next-line lodash/prefer-constant
  () => false
);

export const isRootDiagramSelector = createSelector(
  activeSkillSelector,
  ({ diagramID, rootDiagramID }) => diagramID === rootDiagramID
);

// action creators

export const setActiveSkill = (skill, diagramID) => createAction(SET_ACTIVE_SKILL, { skill, diagramID });

export const updateActiveSkill = (properties, meta) => createAction(UPDATE_ACTIVE_SKILL, { ...properties }, meta);

export const updateDiagramID = (diagramID) => createAction(UPDATE_DIAGRAM_ID, diagramID);

export const setActivePlatform = (platform) => createAction(UPDATE_ACTIVE_SKILL, { platform });

export const replaceGlobalVariables = (variables, meta) => createAction(REPLACE_GLOBAL_VARIABLES, variables, meta);

export const removeGlobalVariable = (variable) => createAction(REMOVE_GLOBAL_VARIABLE, variable);

// side effects

export const addGlobalVariable = (variable) => (dispatch, getState) => {
  const variables = globalVariablesSelector(getState());

  if (!VALID_VARIABLE_NAME.test(variable)) {
    throw new Error('Variables must start with an character and can not contain spaces or special characters');
  }

  if (variables.includes(variable)) {
    throw new Error(`No duplicate variables: ${variable}`);
  }

  dispatch(createAction(ADD_GLOBAL_VARIABLE, variable));
};

export const saveIntents = () => async (dispatch, getState) => {
  const state = getState();
  const skillID = activeSkillIDSelector(state);

  const intents = JSON.stringify(intentAdapter.mapToDB(allIntentsSelector(state)));
  const slots = JSON.stringify(slotAdapter.mapToDB(allSlotsSelector(state)));

  await client.skill.update(skillID, {
    intents,
    slots,
  });
};

export const savePlatform = () => async (dispatch, getState) => {
  const state = getState();
  const skillID = activeSkillIDSelector(state);
  const platform = activePlatformSelector(state);

  await client.skill.update(skillID, { platform });
};

export const saveVariables = () => async (dispatch, getState) => {
  const state = getState();
  const skillID = activeSkillIDSelector(state);
  const global = globalVariablesSelector(state);

  await client.skill.update(skillID, { global });
};
