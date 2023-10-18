import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useSyncedLookup } from '@/hooks';
import { CustomIntentMapContext, EntityMapContext } from '@/pages/Canvas/contexts';
import { EntityPrompt } from '@/pages/Canvas/types';
import { transformSlotsIntoPrompts } from '@/pages/Canvas/utils';
import { transformVariablesToReadable } from '@/utils/slot';

import { ButtonItem } from './types';

interface Options {
  data: Realtime.NodeData<Realtime.NodeData.Buttons>;
  ports: Realtime.NodePorts<Realtime.NodeData.ButtonsBuiltInPorts>;
}

export const useButtons = ({ data, ports }: Options) => {
  const entityMap = React.useContext(EntityMapContext)!;
  const intentsMap = React.useContext(CustomIntentMapContext)!;

  const buttonsByPortID = useSyncedLookup(ports.out.dynamic, data.buttons);

  const buttons = React.useMemo(
    () =>
      ports.out.dynamic
        .filter((portID) => buttonsByPortID[portID])
        .map((portID) => {
          const button = buttonsByPortID[portID];
          const intent = button.intent ? intentsMap[button.intent] ?? null : null;
          const prompts: EntityPrompt[] = intent?.slots.byKey ? transformSlotsIntoPrompts(Object.values(intent.slots.byKey), entityMap) : [];

          const label = transformVariablesToReadable(button.name);

          const buttonItem: ButtonItem = {
            ...button,
            label,
            portID,
            prompts,
            linkedLabel: intent?.name ?? '',
          };

          return buttonItem;
        }),
    [buttonsByPortID, ports.out.dynamic, intentsMap, entityMap]
  );

  return { buttons };
};
