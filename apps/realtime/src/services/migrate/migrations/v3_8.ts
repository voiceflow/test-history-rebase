import { BaseNode, BaseUtils } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { VoiceflowNode } from '@voiceflow/voiceflow-types';

import { Transform } from './types';

/**
 * this migration transforms card nodes into cardV2s
 */
const migrateToV3_8: Transform = ({ diagrams }, { projectType }) => {
  diagrams.forEach((dbDiagram) => {
    Object.values(dbDiagram.nodes).forEach((dbNode) => {
      if (!BaseUtils.step.isCard(dbNode)) return;

      const cardV2: VoiceflowNode.CardV2.Step = {
        ...dbNode,
        type: BaseNode.NodeType.CARD_V2,
        data: {
          title: dbNode.data.title,
          buttons: [],
          imageUrl: dbNode.data.image?.smallImageUrl ?? dbNode.data?.image?.largeImageUrl ?? null,
          description: Realtime.Utils.typeGuards.isVoiceProjectType(projectType)
            ? dbNode.data.text
            : ([{ children: [{ text: dbNode.data.text }] }] as any),
          portsV2: dbNode.data.portsV2 as any,
        },
      };

      Object.assign(dbNode, cardV2);
    });
  });
};

export default migrateToV3_8;
