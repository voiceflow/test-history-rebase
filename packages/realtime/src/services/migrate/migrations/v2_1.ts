import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { Transform } from './types';

/**
 * this migration adds missing ports to carousel nodes
 */
const migrateToV2_1: Transform = ({ diagrams }, { platform, projectType }) => {
  diagrams.forEach((dbDiagram) => {
    const diagram = Realtime.Adapters.creatorAdapter.fromDB(dbDiagram, { platform, projectType, context: {} });

    Object.values(dbDiagram.nodes).forEach((dbNode) => {
      const data = diagram.data[dbNode.nodeID];
      if (!Realtime.Utils.typeGuards.isStep(dbNode) || !Realtime.Utils.typeGuards.isCarouselNodeData(data)) return;

      const allButtonIDs = data.cards.flatMap((card) => card.buttons.map(({ id }) => id));

      allButtonIDs.forEach((id) => {
        if (dbNode.data.portsV2 && !dbNode.data.portsV2?.byKey[id]) {
          // eslint-disable-next-line no-param-reassign
          dbNode.data.portsV2.byKey[id] = {
            id: Utils.id.objectID(),
            type: '',
            target: null,
          };
        }
      });
    });
  });
};

export default migrateToV2_1;
