import * as Realtime from '@voiceflow/realtime-sdk';

import { withoutValue } from '@/utils/array';
import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const removeProjectFromListReducer = createReducer(Realtime.projectList.removeProjectFromList, (state, { projectID, listID }) => {
  const projectList = safeGetNormalizedByKey(state, listID);

  if (projectList) {
    projectList.projects = withoutValue(projectList.projects, projectID);
  }
});

export default removeProjectFromListReducer;
