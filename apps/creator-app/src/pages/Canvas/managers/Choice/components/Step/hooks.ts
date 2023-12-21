import { Utils } from '@voiceflow/common';
import { Channel, Language } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { Designer } from '@/ducks';
import { useSyncedLookup } from '@/hooks';
import { useSelector } from '@/hooks/redux';
import { EntityMapContext, IntentMapContext, RequiredEntityMapContext } from '@/pages/Canvas/contexts';
import { EntityPrompt } from '@/pages/Canvas/types';

import { ChoiceItem } from './types';

interface ChoiceStepOptions {
  data: Realtime.NodeData<Realtime.NodeData.Interaction>;
  ports: Realtime.NodePorts<Realtime.NodeData.InteractionBuiltInPorts>;
}

export const useChoiceStep = ({ data, ports }: ChoiceStepOptions) => {
  const entityMap = React.useContext(EntityMapContext)!;
  const intentsMap = React.useContext(IntentMapContext)!;
  const requiredEntityMap = React.useContext(RequiredEntityMapContext)!;
  const getAllStringResponseVariantsByLanguageChannelResponseID = useSelector(
    Designer.selectors.getAllStringResponseVariantsByLanguageChannelResponseID
  );

  const choicesByPortID = useSyncedLookup(ports.out.dynamic, data.choices);

  const choices = React.useMemo(() => {
    return ports.out.dynamic
      .filter((portID) => choicesByPortID[portID])
      .map<ChoiceItem>((portID) => {
        const { id, intent: intentID } = choicesByPortID[portID];
        const intent = intentID ? intentsMap[intentID] : null;

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

        return {
          key: id,
          label: intent?.name ?? '',
          portID,
          prompts: getPrompts(),
        };
      }, []);
  }, [choicesByPortID, intentsMap, ports.out.dynamic, entityMap, requiredEntityMap, getAllStringResponseVariantsByLanguageChannelResponseID]);

  return { choices };
};
