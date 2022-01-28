import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const addProjectToListReducer = createReducer(Realtime.projectList.addProjectToList, (state, { projectID, listID }) => {
  const projectList = Normal.getOne(state, listID);

  if (projectList && !projectList.projects.some((id) => id === projectID)) {
    projectList.projects = Utils.array.unique([projectID, ...projectList.projects]);
  }
});

export default addProjectToListReducer;
