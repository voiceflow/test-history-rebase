import { Utils } from '@voiceflow/common';

import * as Adapters from '@/adapters';
import { typeGuards } from '@/utils';

import type { Transform } from './types';

/**
 * this migration adds missing ports to carousel nodes
 */
const migrateToV2_1: Transform = ({ diagrams }, { project }) => {
  diagrams.forEach((dbDiagram) => {
    const diagram = Adapters.creatorAdapter.fromDB(dbDiagram, {
      platform: project.platform,
      projectType: project.type,
      context: {},
    });

    Object.values(dbDiagram.nodes).forEach((dbNode) => {
      const data = diagram.data[dbNode.nodeID];
      if (!typeGuards.isStep(dbNode) || !typeGuards.isCarouselNodeData(data)) return;

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
