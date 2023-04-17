import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const removeProjectFromListReducer = createReducer(Realtime.project.crud.remove, (state, { key: projectID }) => {
  const listID = Object.values(state.byKey).find((list) => {
    return list.projects.some((id) => id === projectID);
  })?.id;

  if (!listID) return;

  const projectList = Normal.getOne(state, listID);

  if (projectList) {
    projectList.projects = Utils.array.withoutValue(projectList.projects, projectID);
  }
});

export default removeProjectFromListReducer;
