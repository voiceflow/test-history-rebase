import { NodeSystemPortType, TriggerNodeItem, TriggerNodeItemType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import React, { useMemo } from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { IntentMapContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { TRIGGER_NODE_CONFIG } from './TriggerManager.constants';

export const TriggerStep: ConnectedStep<Realtime.NodeData.Trigger> = ({ data, ports, palette }) => {
  const intentMap = React.useContext(IntentMapContext)!;

  const nonEmptyIntentItem = useMemo(
    () => data.items.find((item): item is TriggerNodeItem & { resourceID: string } => item.type === TriggerNodeItemType.INTENT && !!item.resourceID),
    [data.items]
  );

  const intent = nonEmptyIntentItem ? intentMap[nonEmptyIntentItem.resourceID] : null;

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        <Item
          icon={nonEmptyIntentItem?.settings.local ? 'intentLocal' : TRIGGER_NODE_CONFIG.icon}
          label={intent?.name ?? null}
          portID={ports.out.byKey[NodeSystemPortType.NEXT]}
          palette={palette}
          placeholder="Create or select a trigger"
          multilineLabel
          labelLineClamp={5}
        />
      </Section>
    </Step>
  );
};
