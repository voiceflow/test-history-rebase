/* eslint-disable no-param-reassign */
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { Transform } from './types';

interface DBStartNode extends BaseNode.Start.Step<BaseNode.Start.Step & { color?: string }> {}

const migrateColor = (dbNode: BaseModels.BaseBlock | DBStartNode, newColor: string) => {
  const color = dbNode.data.color?.toLowerCase();

  // do not migrate color if it is not a default color
  if (color && color !== '#a1adba' && color !== 'standard') return;

  dbNode.data.color = newColor;
};

const isStart = (dbNode: BaseModels.BaseDiagramNode): dbNode is DBStartNode => dbNode.type === BaseNode.NodeType.START;
const isBlock = (dbNode: BaseModels.BaseDiagramNode): dbNode is BaseModels.BaseBlock => dbNode.type === BaseModels.BaseNodeType.BLOCK;

/**
 * this migration updates name and color for the blocks with the only intent step
 * as well as updates the color for the start blocks
 */
const migrateToV2_7: Transform = ({ diagrams }) => {
  diagrams.forEach(({ nodes: dbNodes }) => {
    Object.values(dbNodes).forEach((dbNode) => {
      // migrate block color and name for blocks with only intent step
      if (isBlock(dbNode) && dbNode.data.steps.length === 1 && Realtime.Utils.typeGuards.isCanvasChipBlockType(dbNodes[dbNode.data.steps[0]]?.type)) {
        // removing the name to fallback to the intent name
        dbNode.data.name = '';

        migrateColor(dbNode, '#616769');
      } else if (isStart(dbNode)) {
        migrateColor(dbNode, '#43494E');
      }
    });
  });
};

export default migrateToV2_7;
