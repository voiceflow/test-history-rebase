import { Node } from '@voiceflow/base-types';

import type { Transform } from './types';

/**
 * remove the pattern of storing step data inside the ports
 * ports should not be extended
 */
const migrateToV3_3: Transform = ({ diagrams }) => {
  diagrams.forEach((dbDiagram) =>
    Object.values(dbDiagram.nodes).forEach((dbNode) => {
      if (dbNode.type === Node.NodeType.TRACE) {
        const node = dbNode as Node._v1.Step;

        node.data.paths =
          node.data.portsV2?.dynamic?.map((port) => ({
            label: port.data?.event?.type || '',
          })) ?? [];
      }
    })
  );
};

export default migrateToV3_3;
