import * as Platform from '@voiceflow/platform-config';

import { SlateEditorAPI } from '@/components/SlateEditable';

export const isEmptyPrompt = (prompt?: unknown): boolean => {
  if (!prompt) return true;

  if (Platform.Common.Voice.CONFIG.utils.prompt.isPrompt(prompt)) {
    if (prompt.type === Platform.Common.Voice.Models.Prompt.PromptType.TEXT) return !prompt.content?.trim?.();
    if (prompt.type === Platform.Common.Voice.Models.Prompt.PromptType.AUDIO) return !prompt.audio;

    return true;
  }

  if (Platform.Common.Chat.CONFIG.utils.prompt.isPrompt(prompt)) return !SlateEditorAPI.serialize(prompt.content);
  if (Platform.Common.Voice.CONFIG.utils.intent.isPrompt(prompt)) return !prompt.text;

  return true;
};

export const hasValidPrompt = (prompts?: unknown[]): boolean => {
  if (!prompts) return false;

  return prompts.some((prompt) => !isEmptyPrompt(prompt));
};
