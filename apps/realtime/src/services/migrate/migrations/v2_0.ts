/* eslint-disable no-param-reassign */
import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { normalize } from 'normal-store';

import { Transform } from './types';

/**
 * this migration converts the existing port structure from an array to an object
 * with a lookup map for built-in ports that can be enabled or disabled individually
 * and an array for dynamic and ordered ports such as for an `if` or `choice` step
 */
const migrateToV2: Transform = ({ diagrams }, { platform, projectType }) => {
  diagrams.forEach((dbDiagram) => {
    const diagram = Realtime.Adapters.creatorAdapter.fromDB(dbDiagram, { platform, projectType, context: {} });
    const nodes = normalize(diagram.nodes);

    Object.values(dbDiagram.nodes).forEach((dbNode) => {
      // using this function to avoid the type checker getting mad about deleting a non-optional property
      const migratePorts = (portsV2: BaseModels.AnyBaseStepPorts | undefined) => {
        delete dbNode.data.ports;
        dbNode.data.portsV2 = portsV2;
      };

      if (Realtime.Utils.typeGuards.isStep(dbNode) && dbNode.data.ports) {
        const node = nodes.byKey[dbNode.nodeID];
        const data = diagram.data[dbNode.nodeID];

        // using the ports adapters to reliable transform to the new ports schema
        const ports = Realtime.Adapters.stepPortsAdapter.fromDB(dbNode.data, { platform, dbNode, nodeType: node.type });
        const { portsV2 } = Realtime.Adapters.stepPortsAdapter.toDB(ports, {
          platform,
          node,
          data,
          context: { schemaVersion: Realtime.SchemaVersion.V2 },
        });

        migratePorts(portsV2);
      }
    });
  });
};

export default migrateToV2;
