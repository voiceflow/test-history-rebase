/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { Transform } from './types';

/*
 * this migration transforms random nodes into randomV2s
 */
const migrateToV3_5: Transform = ({ diagrams }, { platform, projectType }) => {
  diagrams.forEach((dbDiagram) => {
    const diagram = Realtime.Adapters.creatorAdapter.fromDB(dbDiagram, { platform, projectType, context: {} });

    Object.values(dbDiagram.nodes).forEach((dbNode) => {
      const randomV1 = diagram.data[dbNode.nodeID];

      if (!Realtime.Utils.typeGuards.isStep(dbNode) || !Realtime.Utils.typeGuards.isRandomV1NodeData(randomV1)) return;

      const data = {
        name: 'Random',
        namedPaths: [...Array(randomV1.paths)].map((_, index) => {
          return { label: `Path ${index + 1}` };
        }),
        noDuplicates: randomV1.noDuplicates,
        nodeID: randomV1.nodeID,
        type: Realtime.BlockType.RANDOMV2,
      };

      const dbData = Realtime.Adapters.nodeDataAdapter.toDB(data, { platform, projectType, context: {} });
      dbNode.type = dbData.type;
      dbNode.data = { ...dbData.data, ...(dbNode.data.ports ? { ports: dbNode.data.ports } : { portsV2: dbNode.data.portsV2 }) };
    });
  });
};

export default migrateToV3_5;
