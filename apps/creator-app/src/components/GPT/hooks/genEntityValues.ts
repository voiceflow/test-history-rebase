import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { useTeardown } from '@voiceflow/ui';

import { mlGatewayClient } from '@/client/ml-gateway';
import { isDefaultSlotName } from '@/utils/slot';

import { GenApi, useGen } from './gen';

export const useGenEntityValues = ({
  inputs,
  onAccept,
  disabled,
  entityName,
  entityType,
}: {
  inputs: Realtime.SlotInput[];
  onAccept: (items: Realtime.SlotInput[]) => void;
  disabled?: boolean;
  entityType?: string | null;
  entityName?: string | null;
}): GenApi<Realtime.SlotInput> => {
  const api = useGen<Realtime.SlotInput, string[]>({
    onAccept,
    disabled,
    examples: inputs,

    examplesToDB: (items) =>
      items.map((input) => [input.value.trim(), ...input.synonyms.split(',').map((s) => s.trim())].filter(Boolean)).filter((arr) => arr.length),

    dbExamplesToTrack: (items) => items.map((item) => item.join(',')),

    generate: async (options) => {
      const isDefaultName = isDefaultSlotName(entityName);

      const { results } = await mlGatewayClient.generation.generateEntityValue({
        ...options,
        name: (isDefaultName ? null : entityName) ?? '',
        type: entityType || Realtime.CUSTOM_SLOT_TYPE,
      });

      return results.map(([entityName, ...synonyms]) => ({ id: Utils.id.cuid.slug(), value: entityName, synonyms: synonyms.join(',') }));
    },
  });

  useTeardown(() => {
    api.onAcceptAll();
  });

  return api;
};
