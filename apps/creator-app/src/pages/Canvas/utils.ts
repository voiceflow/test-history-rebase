import { Nullable } from '@voiceflow/common';
import { Entity } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { serializeToText } from '@voiceflow/slate-serializer/text';

import { EntityPrompt } from './types';

export const getIntentPromptContent = ([prompt]: unknown[]) => {
  if (Platform.Common.Chat.CONFIG.utils.prompt.isPrompt(prompt)) {
    return serializeToText(prompt.content, { encodeVariables: true });
  }

  if (Platform.Common.Voice.CONFIG.utils.intent.isPrompt(prompt)) {
    return prompt.text;
  }

  return '';
};

export const transformSlotIntoPrompt = (slot: Realtime.Slot | Entity | null, intentSlot: Platform.Base.Models.Intent.Slot): EntityPrompt | null => {
  if (!intentSlot.required || !intentSlot.dialog.prompt.length) return null;

  const content = getIntentPromptContent(intentSlot.dialog.prompt);

  if (!content || !slot) return null;

  return {
    id: intentSlot.id,
    name: slot.name,
    color: slot.color,
    content,
    entityID: slot.id,
  };
};

export const transformSlotsIntoPrompts = (
  slots: Platform.Base.Models.Intent.Slot[],
  slotsMap: Record<string, Realtime.Slot | Entity>
): EntityPrompt[] =>
  slots.reduce<EntityPrompt[]>((acc, slot) => {
    const slotData = slotsMap[slot.id];
    const entityPrompt = transformSlotIntoPrompt(slotData, slot);

    if (!entityPrompt) return acc;

    return [...acc, entityPrompt];
  }, []);

type MapType<T> = Record<string, T>;

export const getItemFromMap = <T>(map: MapType<T> | undefined, id: Nullable<string>): T | Partial<T> => {
  if (!map || Object.keys(map).length === 0 || !id) {
    return {} as Partial<T>;
  }

  const item = map[id];

  return item || ({} as Partial<T>);
};
