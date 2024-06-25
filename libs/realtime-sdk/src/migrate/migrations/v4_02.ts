import type { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import type { Transform } from './types';

/**
 * this migration removes duplicated port ids
 * generating new ids for each duplicated built in port
 */
const migrateToV4_02: Transform = ({ diagrams }) => {
  diagrams.forEach((dbDiagram) => {
    const portIDs = new Set<string>();

    Object.values(dbDiagram.nodes).forEach((dbNode) => {
      const migratePorts = (value: BaseModels.AnyBaseStepPorts | undefined) => {
        // eslint-disable-next-line no-param-reassign
        dbNode.data.portsV2 = value;
      };

      const portV2 = dbNode.data.portsV2;
      const portID = portV2?.builtIn?.next?.id;

      if (portID) {
        if (portIDs.has(portID)) {
          const newPortID = Utils.id.objectID();
          const newPortV2 = {
            ...portV2,
            builtIn: { ...portV2.builtIn, next: { ...portV2.builtIn.next, id: newPortID } },
          };
          migratePorts(newPortV2);
        }

        portIDs.add(portID);
      }
    });
  });
};

export default migrateToV4_02;
