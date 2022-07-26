import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { CustomIntentMapContext, SlotMapContext } from '@/pages/Canvas/contexts';
import { EntityPrompt } from '@/pages/Canvas/types';
import { transformSlotsIntoPrompts } from '@/pages/Canvas/utils';
import { prettifyIntentName } from '@/utils/intent';
import { transformVariablesToReadable } from '@/utils/slot';

import { ButtonItem } from './types';

interface Options {
  data: Realtime.NodeData<Realtime.NodeData.Buttons>;
  ports: Realtime.NodePorts<Realtime.NodeData.ButtonsBuiltInPorts>;
}

export const useButtons = ({ data, ports }: Options) => {
  const slotMap = React.useContext(SlotMapContext)!;
  const intentsMap = React.useContext(CustomIntentMapContext)!;

  const buttons = React.useMemo(
    () =>
      data.buttons.map((button, index) => {
        const intent = button.intent ? intentsMap[button.intent] ?? null : null;
        const portID = ports.out.dynamic[index];
        const prompts: EntityPrompt[] = intent?.slots.byKey ? transformSlotsIntoPrompts(Object.values(intent.slots.byKey), slotMap) : [];

        const label = transformVariablesToReadable(button.name);
        const linkedLabel = prettifyIntentName(intent?.name);

        const buttonItem: ButtonItem = {
          ...button,
          label,
          portID,
          prompts,
          linkedLabel,
        };

        return buttonItem;
      }),
    [data.buttons, ports.out.dynamic, intentsMap, slotMap]
  );

  return { buttons };
};
