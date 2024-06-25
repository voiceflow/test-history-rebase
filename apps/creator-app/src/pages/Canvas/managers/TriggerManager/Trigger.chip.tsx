import type { TriggerNodeItem } from '@voiceflow/dtos';
import { NodeSystemPortType, TriggerNodeItemType } from '@voiceflow/dtos';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React, { useMemo } from 'react';

import Chip from '@/pages/Canvas/components/Chip';
import { IntentMapContext } from '@/pages/Canvas/contexts';
import type { ConnectedChip } from '@/pages/Canvas/managers/types';

import { TRIGGER_NODE_CONFIG } from './TriggerManager.constants';

export const TriggerChip: ConnectedChip<Realtime.NodeData.Trigger> = ({ data, ports }) => {
  const intentMap = React.useContext(IntentMapContext)!;

  const nonEmptyIntentItem = useMemo(
    () =>
      data.items.find(
        (item): item is TriggerNodeItem & { resourceID: string } =>
          item.type === TriggerNodeItemType.INTENT && !!item.resourceID
      ),
    [data.items]
  );

  const intent = nonEmptyIntentItem ? intentMap[nonEmptyIntentItem.resourceID] : null;
  const isEmpty = !!data.items.length && !intent;

  return (
    <Chip
      name={intent?.name ?? null}
      icon={TRIGGER_NODE_CONFIG.icon!}
      portID={ports.out.byKey[NodeSystemPortType.NEXT]}
      placeholder={isEmpty ? 'Empty intent' : 'Add trigger...'}
    />
  );
};
