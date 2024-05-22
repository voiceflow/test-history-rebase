import type { z } from 'zod';

import { PromptDTO } from '../../prompt/prompt.dto';
import { PromptResponseVariantDTO, TextResponseVariantDTO } from './response-variant.dto';

export const PromptResponseVariantWithPromptDTO = PromptResponseVariantDTO.extend({
  prompt: PromptDTO,
}).strict();

export type PromptResponseVariantWithPrompt = z.infer<typeof PromptResponseVariantWithPromptDTO>;

// TODO: add prompt response variant type
export const AnyResponseVariantWithDataDTO = TextResponseVariantDTO;

export type AnyResponseVariantWithData = z.infer<typeof AnyResponseVariantWithDataDTO>;
