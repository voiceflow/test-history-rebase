import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const reorderMenuItemReducer = createReducer(
  Realtime.diagram.reorderMenuItem,
  (state, { diagramID, sourceID, toIndex }) => {
    const diagram = Normal.getOne(state, diagramID);

    if (!diagram) return;

    const fromIndex = diagram.menuItems.findIndex((item) => item.sourceID === sourceID);

    diagram.menuItems = Utils.array.reorder(diagram.menuItems, fromIndex, toIndex);
  }
);

export default reorderMenuItemReducer;
