import client from '@/client';
import intentAdapter from '@/client/adapters/intent';
import skillMetaAdapter from '@/client/adapters/skill/meta';
import slotAdapter from '@/client/adapters/slot';
import { VALID_VARIABLE_NAME } from '@/constants';
import { allIntentsSelector } from '@/ducks/intent/selectors';
import { allSlotsSelector } from '@/ducks/slot';
import { createAction } from '@/ducks/utils';

import { updateSkillMeta } from './meta';
import { ADD_GLOBAL_VARIABLE, activePlatformSelector, activeSkillIDSelector, globalVariablesSelector, updateActiveSkill } from './skill';

// eslint-disable-next-line import/prefer-default-export
export const saveSkillSettings = (settings) => async (dispatch, getState) => {
  const { name, ...meta } = settings;
  const state = getState();
  const skillID = activeSkillIDSelector(state);

  await client.skill.update(skillID, skillMetaAdapter.toDB(settings));
  dispatch(updateActiveSkill({ name }));
  dispatch(updateSkillMeta(meta));
};

export const addGlobalVariable = (variable) => (dispatch, getState) => {
  if (variable) {
    const variables = globalVariablesSelector(getState());

    if (!VALID_VARIABLE_NAME.test(variable)) {
      throw new Error('Variables must start with an character and can not contain spaces or special characters');
    }

    if (variables.includes(variable)) {
      throw new Error(`No duplicate variables: ${variable}`);
    }

    dispatch(createAction(ADD_GLOBAL_VARIABLE, variable));
  }
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
