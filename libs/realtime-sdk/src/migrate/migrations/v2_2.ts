import { BlockType } from '@realtime-sdk/constants';
import type { Markup } from '@realtime-sdk/models';
import type { BaseModels } from '@voiceflow/base-types';

import type { Transform } from './types';

/**
 * this migration moves all image steps to match the transform translate(-50%,-50%) applied to center the image
 */
const migrateToV2_2: Transform = ({ diagrams }) =>
  diagrams.forEach((dbDiagram) =>
    Object.values(dbDiagram.nodes).forEach((dbNode) => {
      if (dbNode.type !== BlockType.MARKUP_IMAGE || !dbNode.coords) return;
      const [x, y] = dbNode.coords;
      const { width, height } = (dbNode as BaseModels.BaseDiagramNode<Markup.NodeData.Image>).data;

      // eslint-disable-next-line no-param-reassign
      dbNode.coords = [x + width / 2, y + height / 2];
    })
  );

export default migrateToV2_2;
