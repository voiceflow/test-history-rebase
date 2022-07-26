import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useSyncedLookup } from '@/hooks';
import { CustomIntentMapContext, SlotMapContext } from '@/pages/Canvas/contexts';
import { EntityPrompt } from '@/pages/Canvas/types';
import { transformSlotsIntoPrompts } from '@/pages/Canvas/utils';
import { prettifyIntentName } from '@/utils/intent';

import { ChoiceItem } from './types';

interface ChoiceStepOptions {
  data: Realtime.NodeData<Realtime.NodeData.Interaction>;
  ports: Realtime.NodePorts<Realtime.NodeData.InteractionBuiltInPorts>;
}

export const useChoiceStep = ({ data, ports }: ChoiceStepOptions) => {
  const intentsMap = React.useContext(CustomIntentMapContext)!;
  const slotMap = React.useContext(SlotMapContext)!;

  const choicesByPortID = useSyncedLookup(ports.out.dynamic, data.choices);

  const choices = React.useMemo(() => {
    return ports.out.dynamic.reduce<ChoiceItem[]>((acc, portID) => {
      if (!choicesByPortID[portID]) return acc;

      const { id, intent } = choicesByPortID[portID];

      const intentEntity = intent ? intentsMap[intent] : null;
      const prompts: EntityPrompt[] = intentEntity?.slots.byKey ? transformSlotsIntoPrompts(Object.values(intentEntity.slots.byKey), slotMap) : [];

      acc.push({
        key: id,
        label: prettifyIntentName(intentEntity?.name),
        portID,
        prompts,
      });

      return acc;
    }, []);
  }, [choicesByPortID, intentsMap, ports.out.dynamic]);

  return { choices };
};
