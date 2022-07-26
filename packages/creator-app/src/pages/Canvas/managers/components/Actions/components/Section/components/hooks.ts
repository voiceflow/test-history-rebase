import { EmptyObject } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import * as IntentV2 from '@/ducks/intentV2';
import { useSelector } from '@/hooks';
import { ManagerContext } from '@/pages/Canvas/contexts';
import { prettifyIntentName } from '@/utils/intent';

interface ItemConfig {
  icon?: SvgIconTypes.Icon;
  isEmpty: boolean;
  placeholder: string;
  defaultName: string;
}

export const useItemConfig = (data: Realtime.NodeData<EmptyObject>): ItemConfig => {
  const manager = React.useContext(ManagerContext)!(data.type);

  const intentMap = useSelector(IntentV2.customIntentMapSelector);
  const startingBlocks = useSelector(DiagramV2.startingBlocksSelector);

  switch (data.type) {
    case Realtime.BlockType.GO_TO_INTENT: {
      const { intent: intentID } = data as Realtime.NodeData<Realtime.NodeData.GoToIntent>;

      const goToIntent = intentID ? intentMap[intentID] : null;

      return {
        icon: manager.icon,
        isEmpty: !goToIntent,
        defaultName: goToIntent ? `Go to '${prettifyIntentName(goToIntent.name)}' intent` : '',
        placeholder: 'Select go-to intent',
      };
    }

    case Realtime.BlockType.GO_TO_NODE: {
      const { goToNodeID, diagramID } = data as Realtime.NodeData<Realtime.NodeData.GoToNode>;

      const goToNode = diagramID && goToNodeID ? startingBlocks[diagramID]?.[goToNodeID] ?? null : null;

      return {
        icon: manager.icon,
        isEmpty: !goToNode,
        defaultName: goToNode ? `Go to '${prettifyIntentName(goToNode.name)}' block` : '',
        placeholder: 'Select go-to block',
      };
    }

    case Realtime.BlockType.URL: {
      const { url } = data as Realtime.NodeData<Realtime.NodeData.Url>;

      return {
        icon: manager.icon,
        isEmpty: !url,
        defaultName: 'Open URL',
        placeholder: 'Add URL',
      };
    }

    case Realtime.BlockType.EXIT: {
      return {
        icon: manager.icon,
        isEmpty: false,
        defaultName: 'End conversation',
        placeholder: 'End conversation',
      };
    }

    default:
      return {
        icon: manager.icon,
        isEmpty: false,
        defaultName: manager.factory?.()?.data.name ?? '',
        placeholder: manager.label ?? 'Unknown action',
      };
  }
};
