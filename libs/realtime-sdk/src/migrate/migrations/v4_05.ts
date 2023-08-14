import { BlockType } from '@realtime-sdk/constants';
import { BaseModels } from '@voiceflow/base-types';

import { Transform } from './types';

/**
 * card and carousel steps have hidden next ports that can not be seen or edited by the user
 * copy and paste actions would assign these ports to steps that could be deleted/moved and cause unexpected runtime behavior
 * step mapping is now handled by general-service
 */
const migrateToV4_05: Transform = ({ diagrams }) => {
  diagrams.forEach((dbDiagram) =>
    Object.values(dbDiagram.nodes).forEach((dbNode) => {
      if (dbNode.type === BlockType.CAROUSEL || dbNode.type === BlockType.CARDV2) {
        const nextPort = dbNode?.data?.portsV2?.builtIn[BaseModels.PortType.NEXT];

        if (nextPort?.target) nextPort.target = null;
      }
    })
  );
};

export default migrateToV4_05;
