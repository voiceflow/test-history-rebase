import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

/**
 * @deprecated use `reorderMenuItemReducer` instead
 */
const reorderMenuNodeReducer = createReducer(Realtime.diagram.reorderMenuNode, (state, { diagramID, nodeID, toIndex }) => {
  const diagram = Normal.getOne(state, diagramID);

  if (!diagram) return;

  const fromIndex = diagram.menuItems.findIndex((item) => item.type === BaseModels.Diagram.MenuItemType.NODE && item.sourceID === nodeID);

  diagram.menuItems = Utils.array.reorder(diagram.menuItems, fromIndex, toIndex);
});

export default reorderMenuNodeReducer;
