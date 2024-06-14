import { Entity } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { serializeToText } from '@voiceflow/slate-serializer/text';

import { EntityPrompt } from './types';

export const getIntentPromptContent = (
  [prompt]: unknown[],
  variablesMap: Record<string, { id: string; name: string }>
) => {
  if (Platform.Common.Chat.CONFIG.utils.prompt.isPrompt(prompt)) {
    return serializeToText(prompt.content, { variablesMap, encodeVariables: true });
  }

  if (Platform.Common.Voice.CONFIG.utils.intent.isPrompt(prompt)) {
    return prompt.text;
  }

  return '';
};

export const transformSlotIntoPrompt = (
  slot: Realtime.Slot | Entity | null,
  intentSlot: Platform.Base.Models.Intent.Slot,
  variablesMap: Record<string, { id: string; name: string }>
): EntityPrompt | null => {
  if (!intentSlot.required || !intentSlot.dialog.prompt.length) return null;

  const content = getIntentPromptContent(intentSlot.dialog.prompt, variablesMap);

  if (!content || !slot) return null;

  return {
    id: intentSlot.id,
    name: slot.name,
    color: slot.color,
    content,
    entityID: slot.id,
  };
};
