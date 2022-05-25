import { ChatModels } from '@voiceflow/chat-types';
import { slate } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceModels } from '@voiceflow/voice-types';

import { EntityPrompt } from './types';

type Slots = Array<Realtime.VoiceIntentSlot<string> | Realtime.ChatIntentSlot>;

const getPromptContent = (prompt: VoiceModels.IntentPrompt<string>[] | ChatModels.Prompt[]) => {
  const promptContent = prompt[0] as any;
  if (promptContent.text) return promptContent.text;
  return slate.toPlaintext(promptContent.content?.[0].children);
};

export const transformSlotIntoPrompt = (slotData: Realtime.Slot, slot: Realtime.VoiceIntentSlot<string> | Realtime.ChatIntentSlot) => {
  if (!slot.required || !slot.dialog.prompt.length) return null;

  const content = getPromptContent(slot.dialog.prompt);
  const name = slotData?.name;
  const color = slotData?.color;

  if (!content || !name || !color) return null;

  const entityPrompt: EntityPrompt = { id: slot.id, name, content, color };
  return entityPrompt;
};

export const transformSlotsIntoPrompts = (slots: Slots, slotsMap: Record<string, Realtime.Slot>): EntityPrompt[] => {
  return slots.reduce((acc, slot) => {
    const slotData = slotsMap[slot.id];
    const entityPrompt = transformSlotIntoPrompt(slotData, slot);

    if (!entityPrompt) return acc;

    return [...acc, entityPrompt];
  }, [] as EntityPrompt[]);
};
