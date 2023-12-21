import { Utils } from '@voiceflow/common';
import { Channel, Language } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { Designer } from '@/ducks';
import { useSyncedLookup } from '@/hooks';
import { useSelector } from '@/hooks/redux';
import { EntityMapContext, IntentMapContext, RequiredEntityMapContext } from '@/pages/Canvas/contexts';
import { EntityPrompt } from '@/pages/Canvas/types';
import { transformVariablesToReadable } from '@/utils/slot';

import { ButtonItem } from './types';

interface Options {
  data: Realtime.NodeData<Realtime.NodeData.Buttons>;
  ports: Realtime.NodePorts<Realtime.NodeData.ButtonsBuiltInPorts>;
}

export const useButtons = ({ data, ports }: Options) => {
  const entityMap = React.useContext(EntityMapContext)!;
  const intentsMap = React.useContext(IntentMapContext)!;
  const requiredEntityMap = React.useContext(RequiredEntityMapContext)!;
  const getAllStringResponseVariantsByLanguageChannelResponseID = useSelector(
    Designer.selectors.getAllStringResponseVariantsByLanguageChannelResponseID
  );

  const buttonsByPortID = useSyncedLookup(ports.out.dynamic, data.buttons);

  const buttons = React.useMemo(() => {
    return ports.out.dynamic
      .filter((portID) => buttonsByPortID[portID])
      .map((portID) => {
        const button = buttonsByPortID[portID];
        const intent = button.intent ? intentsMap[button.intent] ?? null : null;

        const getPrompts = (): EntityPrompt[] => {
          if (!intent) return [];

          return intent.entityOrder
            .map((requiredEntityID) => {
              const requiredEntity = requiredEntityMap[requiredEntityID];

              if (!requiredEntity) return null;

              const entity = entityMap[requiredEntity.entityID];

              if (!entity) return null;

              const content = getAllStringResponseVariantsByLanguageChannelResponseID({
                responseID: requiredEntity.repromptID,
                channel: Channel.DEFAULT,
                language: Language.ENGLISH_US,
              });

              if (!content[0]) return null;

              return {
                id: requiredEntityID,
                name: entity.name,
                color: entity.color,
                content: content[0],
                entityID: entity.id,
              };
            })
            .filter(Utils.array.isNotNullish);
        };

        const label = transformVariablesToReadable(button.name);

        const buttonItem: ButtonItem = {
          ...button,
          label,
          portID,
          prompts: getPrompts(),
          linkedLabel: intent?.name ?? '',
        };

        return buttonItem;
      });
  }, [buttonsByPortID, ports.out.dynamic, intentsMap, entityMap, requiredEntityMap, getAllStringResponseVariantsByLanguageChannelResponseID]);

  return { buttons };
};
