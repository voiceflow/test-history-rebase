import client from '@/client';
import skillMetaAdapter from '@/client/adapters/skill/meta';

import { updateSkillMeta } from './meta';
import { activeSkillIDSelector, updateActiveSkill } from './skill';

// eslint-disable-next-line import/prefer-default-export
export const saveSkillSettings = (settings) => async (dispatch, getState) => {
  const { name, ...meta } = settings;
  const state = getState();
  const skillID = activeSkillIDSelector(state);

  await client.skill.update(skillID, skillMetaAdapter.toDB(settings));
  dispatch(updateActiveSkill({ name }));
  dispatch(updateSkillMeta(meta));
};
