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

export const transformSlotIntoPrompt = (slotData: Realtime.Slot, slot: Platform.Base.Models.Intent.Slot): EntityPrompt | null => {
  if (!slot.required || !slot.dialog.prompt.length) return null;

  const content = getIntentPromptContent(slot.dialog.prompt);
  const name = slotData?.name;
  const color = slotData?.color;

  if (!content || !name || !color) return null;

  return { id: slot.id, name, color, content };
};

export const transformSlotsIntoPrompts = (slots: Platform.Base.Models.Intent.Slot[], slotsMap: Record<string, Realtime.Slot>): EntityPrompt[] =>
  slots.reduce<EntityPrompt[]>((acc, slot) => {
    const slotData = slotsMap[slot.id];
    const entityPrompt = transformSlotIntoPrompt(slotData, slot);

    if (!entityPrompt) return acc;

    return [...acc, entityPrompt];
  }, []);
