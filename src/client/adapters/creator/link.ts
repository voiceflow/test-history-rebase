import { BlockType } from '@/constants';
import { DBLink, Link, Node } from '@/models';
import { Normalized, getNormalizedByKey } from '@/utils/normalized';

import { createAdapter } from '../utils';

const linkAdapter = createAdapter<DBLink, Link, [], [{ nodes: Normalized<Node> }]>(
  (dbLink) => ({
    id: dbLink.id,
    source: {
      portID: dbLink.sourcePort,
      nodeID: dbLink.source,
    },
    target: dbLink.virtual || {
      portID: dbLink.targetPort,
      nodeID: dbLink.target,
    },
  }),
  (rawAppLink, { nodes }) => {
    const targetNode = getNormalizedByKey(nodes, rawAppLink.target.nodeID);
    let appLink: Link & { virtual?: Link['target'] } = rawAppLink;

    // only apply this transformation to links that terminate at a virtual node
    if (targetNode.type === BlockType.COMBINED && targetNode.combinedNodes.length === 1) {
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

    return {
      id: appLink.id,
      source: appLink.source.nodeID,
      sourcePort: appLink.source.portID,
      target: appLink.target.nodeID,
      targetPort: appLink.target.portID,
      virtual: appLink.virtual || undefined,
    };
  }
);

export default linkAdapter;
