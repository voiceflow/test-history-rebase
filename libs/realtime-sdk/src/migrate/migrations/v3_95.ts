/* eslint-disable no-param-reassign */
import { BaseModels } from '@voiceflow/base-types';

import type { Transform } from './types';

/**
 * this migration remaps diagram.menuNodeIDs to diagram.menuItems
 */
const migrateToV3_95: Transform = ({ diagrams }) => {
  diagrams.forEach((dbDiagram) => {
    if (!dbDiagram.menuNodeIDs?.length) return;

    dbDiagram.menuItems = dbDiagram.menuNodeIDs.map((nodeID) => ({
      type: BaseModels.Diagram.MenuItemType.NODE,
      sourceID: nodeID,
    }));
    dbDiagram.menuNodeIDs = [];
  });
};

export default migrateToV3_95;
