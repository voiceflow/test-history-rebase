import { BaseNode, BaseUtils } from '@voiceflow/base-types';

import type { Transform } from './types';

/*
 * this migration transforms random nodes into randomV2s
 */
const migrateToV3_5: Transform = ({ diagrams }) => {
  diagrams.forEach((dbDiagram) => {
    Object.values(dbDiagram.nodes).forEach((dbNode) => {
      if (!BaseUtils.step.isRandom(dbNode)) return;

      const randomV2: BaseNode.RandomV2.Step = {
        ...dbNode,
        type: BaseNode.NodeType.RANDOM_V2,
        data: {
          ...dbNode.data,
          namedPaths: Array.from({ length: dbNode.data.paths }, (_, i) => ({ label: `Path ${i + 1}` })),
        },
      };

      Object.assign(dbNode, randomV2);
    });
  });
};

export default migrateToV3_5;
