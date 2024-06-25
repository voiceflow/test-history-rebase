/* eslint-disable no-param-reassign */

import { BaseModels, BaseNode } from '@voiceflow/base-types';

import type { Transform } from './types';

/**
 * this migration removes components items from the menu items list
 */
const migrateToV4_03: Transform = ({ diagrams }) => {
  diagrams.forEach((dbDiagram) => {
    dbDiagram.menuItems = dbDiagram.menuItems?.filter(
      (item) =>
        item.type !== BaseModels.Diagram.MenuItemType.NODE ||
        dbDiagram.nodes[item.sourceID]?.type !== BaseNode.NodeType.COMPONENT
    );
  });
};

export default migrateToV4_03;
