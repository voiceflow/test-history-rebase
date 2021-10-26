import * as Realtime from '@voiceflow/realtime-sdk';

import { append } from '@/utils/array';
import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const addProjectToListReducer = createReducer(Realtime.projectList.addProjectToList, (state, { projectID, listID }) => {
  const projectList = safeGetNormalizedByKey(state, listID);

  if (projectList) {
    projectList.projects = append(projectList.projects, projectID);
  }
});

export default addProjectToListReducer;
