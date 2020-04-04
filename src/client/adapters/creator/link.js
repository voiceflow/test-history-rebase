import cuid from 'cuid';

import { BlockType } from '@/constants';
import { getNormalizedByKey } from '@/utils/normalized';

import { createAdapter } from '../utils';

const linkAdapter = createAdapter(
  (dbLink, isBlockRedesignEnabled) => ({
    id: dbLink.id,
    points: dbLink.points.map(({ x, y }) => ({ x, y })),
    source: {
      portID: dbLink.sourcePort,
      nodeID: dbLink.source,
    },
    target: (isBlockRedesignEnabled && dbLink.virtual) || {
      portID: dbLink.targetPort,
      nodeID: dbLink.target,
    },
  }),
  (rawAppLink, { nodes, isBlockRedesignEnabled }) => {
    let appLink = rawAppLink;

    if (isBlockRedesignEnabled) {
      const targetNode = getNormalizedByKey(nodes, rawAppLink.target.nodeID);

      // only apply this transformation to links that terminate at a virtual node
      if (targetNode.virtual || targetNode.type === BlockType.COMBINED) {
        const actualTargetNode = getNormalizedByKey(nodes, targetNode.combinedNodes[0]);

        appLink = {
          ...rawAppLink,
          target: {
            nodeID: actualTargetNode.id,
            portID: actualTargetNode.ports.in[0],
          },
          virtual: rawAppLink.target,
        };
      }
    }

    return {
      id: appLink.id,
      points: appLink.points || [({ id: cuid.slug() }, { id: cuid.slug() })],
      source: appLink.source.nodeID,
      sourcePort: appLink.source.portID,
      target: appLink.target.nodeID,
      targetPort: appLink.target.portID,
      virtual: appLink.virtual || null,
    };
  }
);

export default linkAdapter;
