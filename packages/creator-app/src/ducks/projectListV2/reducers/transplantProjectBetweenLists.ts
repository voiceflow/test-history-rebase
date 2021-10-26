import * as Realtime from '@voiceflow/realtime-sdk';

import { insert, reorder, withoutValue } from '@/utils/array';
import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const transplantProjectBetweenListsReducer = createReducer(Realtime.projectList.transplantProjectBetweenLists, (state, { from, to }) => {
  if (from.listID === to.listID) {
    const list = safeGetNormalizedByKey(state, from.listID);

    if (list) {
      list.projects = reorder(
        list.projects,
        list.projects.indexOf(from.projectID),
        typeof to.target === 'number' ? to.target : list.projects.indexOf(to.target)
      );
    }
  } else {
    const sourceList = safeGetNormalizedByKey(state, from.listID);
    const targetList = safeGetNormalizedByKey(state, to.listID);

    if (sourceList && targetList) {
      sourceList.projects = withoutValue(sourceList.projects, from.projectID);
      targetList.projects = insert(
        targetList.projects,
        typeof to.target === 'number' ? to.target : targetList.projects.indexOf(to.target),
        from.projectID
      );
    }
  }
});

export default transplantProjectBetweenListsReducer;
