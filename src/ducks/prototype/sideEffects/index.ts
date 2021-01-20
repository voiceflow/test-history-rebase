import * as Skill from '@/ducks/skill';
import { SyncThunk } from '@/store/types';

import { updatePrototypeMode } from '../actions';
import { PrototypeMode } from '../types';

export { default as startPrototype } from './start';
export { default as resetPrototype } from './reset';
export { default as fetchContext } from './fetchContext';
export { default as renderPrototype } from './render';

export const updateActivePrototypeMode = (mode: PrototypeMode): SyncThunk => (dispatch, getState) => {
  const projectID = Skill.activeProjectIDSelector(getState());

  dispatch(updatePrototypeMode(projectID, mode));
};
