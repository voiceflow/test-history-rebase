import type { Prompt } from '../../prompt/prompt.interface';
import type { JSONResponseVariant, PromptResponseVariant, TextResponseVariant } from './response-variant.interface';

export interface PromptResponseVariantWithPrompt extends PromptResponseVariant {
  prompt: Prompt;
}

export type AnyResponseVariantWithData = JSONResponseVariant | TextResponseVariant | PromptResponseVariantWithPrompt;
