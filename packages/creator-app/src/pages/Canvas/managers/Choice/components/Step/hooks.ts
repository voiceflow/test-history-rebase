import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useSyncedLookup } from '@/hooks';
import { CustomIntentMapContext, SlotMapContext } from '@/pages/Canvas/contexts';
import { EntityPrompt } from '@/pages/Canvas/types';
import { transformSlotsIntoPrompts } from '@/pages/Canvas/utils';

import { ChoiceItem } from './types';

interface ChoiceStepOptions {
  data: Realtime.NodeData<Realtime.NodeData.Interaction>;
  ports: Realtime.NodePorts<Realtime.NodeData.InteractionBuiltInPorts>;
}

export const useChoiceStep = ({ data, ports }: ChoiceStepOptions) => {
  const slotMap = React.useContext(SlotMapContext)!;
  const intentsMap = React.useContext(CustomIntentMapContext)!;

  const choicesByPortID = useSyncedLookup(ports.out.dynamic, data.choices);

  const choices = React.useMemo(
    () =>
      ports.out.dynamic
        .filter((portID) => choicesByPortID[portID])
        .map<ChoiceItem>((portID) => {
          const { id, intent } = choicesByPortID[portID];

          const intentEntity = intent ? intentsMap[intent] : null;
          const prompts: EntityPrompt[] = intentEntity?.slots.byKey
            ? transformSlotsIntoPrompts(Object.values(intentEntity.slots.byKey), slotMap)
            : [];

          return {
            key: id,
            label: intentEntity?.name ?? '',
            portID,
            prompts,
          };
        }, []),
    [choicesByPortID, intentsMap, ports.out.dynamic, slotMap]
  );

  return { choices };
};
