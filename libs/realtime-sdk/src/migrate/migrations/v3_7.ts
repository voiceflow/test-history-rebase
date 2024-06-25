import { BaseNode, BaseUtils } from '@voiceflow/base-types';
import type { VoiceflowNode } from '@voiceflow/voiceflow-types';

import type { Transform } from './types';

/**
 * this migration transforms the cardV2 data structure
 */
const migrateToV3_7: Transform = ({ diagrams }) => {
  diagrams.forEach((dbDiagram) => {
    Object.values(dbDiagram.nodes).forEach((dbNode) => {
      if (!BaseUtils.step.isCardV2(dbNode) || !(dbNode.data as any).card) return;

      const cardV2: VoiceflowNode.CardV2.Step = {
        ...dbNode,
        type: BaseNode.NodeType.CARD_V2,
        data: {
          title: (dbNode.data as any).card.title,
          buttons: (dbNode.data as any).card.buttons,
          imageUrl: (dbNode.data as any).card.imageUrl,
          description: (dbNode.data as any).card.description,
          ...(dbNode.data.ports ? { ports: dbNode.data.ports } : { portsV2: dbNode.data.portsV2 }),
        },
      };

      Object.assign(dbNode, cardV2);
    });
  });
};

export default migrateToV3_7;
