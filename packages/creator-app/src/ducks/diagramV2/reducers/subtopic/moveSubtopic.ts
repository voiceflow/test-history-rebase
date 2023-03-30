import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const moveSubtopicReducer = createReducer(Realtime.diagram.subtopicMove, (state, { rootTopicID, subtopicID, toTopicID }) => {
  const diagram = Normal.getOne(state, rootTopicID);
  const toDiagram = Normal.getOne(state, toTopicID);

  if (!diagram || !toDiagram) return;

  // remove from old topic
  diagram.menuItems = diagram.menuItems.filter((item) => item.sourceID !== subtopicID);

  // move to new topic
  toDiagram.menuItems = Utils.array.insert(toDiagram.menuItems, 0, { type: BaseModels.Diagram.MenuItemType.DIAGRAM, sourceID: subtopicID });
});

export default moveSubtopicReducer;
