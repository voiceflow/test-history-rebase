import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const addManyCustomThemes = createReducer(Realtime.project.addManyCustomThemes, (state, { projectID, values }) => {
  const project = Normal.getOne(state, projectID);

  if (!project) return;

  project.customThemes.push(...values);
});

export default addManyCustomThemes;
