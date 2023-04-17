import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const removeProjectFromListReducer = createReducer(Realtime.projectList.removeProjectFromList, (state, { projectID, listID }) => {
  const projectList = Normal.getOne(state, listID);

  if (projectList) {
    projectList.projects = Utils.array.withoutValue(projectList.projects, projectID);
  }
});

export default removeProjectFromListReducer;
