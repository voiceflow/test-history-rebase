import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const updatePlatformData = createReducer(Realtime.project.patchPlatformData, (state, { projectID, platformData }) => {
  const project = Normal.getOne(state, projectID);

  if (!project) return;

  project.platformData = { ...project.platformData, ...platformData };
});

export default updatePlatformData;
