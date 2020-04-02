import cuid from 'cuid';

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
  (appLink) => ({
    id: appLink.id,
    points: appLink.points || [({ id: cuid.slug() }, { id: cuid.slug() })],
    source: appLink.source.nodeID,
    sourcePort: appLink.source.portID,
    target: appLink.target.nodeID,
    targetPort: appLink.target.portID,
    virtual: appLink.virtual || null,
  })
);

export default linkAdapter;
