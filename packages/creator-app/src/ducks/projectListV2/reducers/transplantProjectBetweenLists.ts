import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const transplantProjectBetweenListsReducer = createReducer(Realtime.projectList.transplantProjectBetweenLists, (state, { from, to }) => {
  if (from.listID === to.listID) {
    const list = Utils.normalized.safeGetNormalizedByKey(state, from.listID);

    if (list) {
      list.projects = Utils.array.reorder(
        list.projects,
        list.projects.indexOf(from.projectID),
        typeof to.target === 'number' ? to.target : list.projects.indexOf(to.target)
      );
    }
  } else {
    const sourceList = Utils.normalized.safeGetNormalizedByKey(state, from.listID);
    const targetList = Utils.normalized.safeGetNormalizedByKey(state, to.listID);

    if (sourceList && targetList) {
      sourceList.projects = Utils.array.withoutValue(sourceList.projects, from.projectID);
      targetList.projects = Utils.array.insert(
        targetList.projects,
        typeof to.target === 'number' ? to.target : targetList.projects.indexOf(to.target),
        from.projectID
      );
    }
  }
});

export default transplantProjectBetweenListsReducer;
