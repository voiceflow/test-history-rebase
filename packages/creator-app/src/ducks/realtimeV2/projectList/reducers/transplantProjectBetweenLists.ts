import * as Realtime from '@voiceflow/realtime-sdk';

import { insert, reorder, withoutValue } from '@/utils/array';

import { createReducer } from './utils';

const transplantProjectBetweenListsReducer = createReducer(Realtime.projectList.transplantProjectBetweenLists, (state, { from, to }) => {
  if (from.listID === to.listID) {
    const list = state.byKey[from.listID];

    list.projects = reorder(list.projects, list.projects.indexOf(from.projectID), list.projects.indexOf(to.projectID));
  } else {
    const sourceList = state.byKey[from.listID];
    const targetList = state.byKey[to.listID];

    sourceList.projects = withoutValue(sourceList.projects, from.projectID);
    targetList.projects = insert(targetList.projects, targetList.projects.indexOf(to.projectID), from.projectID);
  }
});

export default transplantProjectBetweenListsReducer;
