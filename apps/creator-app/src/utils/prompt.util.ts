import type { Prompt } from '@voiceflow/sdk-logux-designer';

import { isMarkupEmpty } from './markup.util';

export const isPromptEmpty = (prompt: Prompt): boolean => isMarkupEmpty(prompt.text);

export const isPromptsArrayEmpty = (prompts: Prompt[]): boolean => !prompts.length || prompts.every(isPromptEmpty);
