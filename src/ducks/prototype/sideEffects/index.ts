import client from '@/client';
import { toast } from '@/components/Toast';
import * as Skill from '@/ducks/skill';
import { SyncThunk } from '@/store/types';

import { updatePrototypeMode, updatePrototypeSettings } from '../actions';
import { PrototypeMode, PrototypeShareViewSettings } from '../types';

export { default as fetchContext } from './fetchContext';
export { default as renderPrototype } from './render';
export { default as resetPrototype } from './reset';
export { default as setupPublicPrototype } from './setupPublicPrototype';
export { default as startPrototype } from './start';
export { default as validateModel } from './validateModel';

export const updateActivePrototypeMode = (mode: PrototypeMode): SyncThunk => (dispatch, getState) => {
  const projectID = Skill.activeProjectIDSelector(getState());

  dispatch(updatePrototypeMode(projectID, mode));
};

export const updateSharePrototypeSettings = (data: Partial<PrototypeShareViewSettings>): SyncThunk => async (dispatch, getState) => {
  const versionID = Skill.activeSkillIDSelector(getState());

  try {
    await client.api.version.updatePrototypeSettings(versionID, data);

    dispatch(updatePrototypeSettings(data));
  } catch (e) {
    toast.error('Something went wrong');
  }
};
