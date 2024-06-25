import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const transplantProjectBetweenListsReducer = createReducer(
  Realtime.projectList.transplantProjectBetweenLists,
  (state, { from, to }, { meta }) => {
    if (meta?.persistOnly) return;

    if (from.listID === to.listID) {
      const list = Normal.getOne(state, from.listID);

      if (!list) return;

      const fromIndex = list.projects.indexOf(from.projectID);

      list.projects = Utils.array.reorder(list.projects, fromIndex, to.index);

      return;
    }

    const sourceList = Normal.getOne(state, from.listID);
    const targetList = Normal.getOne(state, to.listID);

    if (!sourceList || !targetList) return;

    sourceList.projects = Utils.array.withoutValue(sourceList.projects, from.projectID);
    targetList.projects = Utils.array.insert(
      Utils.array.withoutValue(targetList.projects, from.projectID),
      to.index,
      from.projectID
    );
  }
);

export default transplantProjectBetweenListsReducer;
