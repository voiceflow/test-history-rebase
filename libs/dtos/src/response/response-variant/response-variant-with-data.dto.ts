import { z } from 'zod';

import { PromptDTO } from '../../prompt/prompt.dto';
import { JSONResponseVariantDTO, PromptResponseVariantDTO, TextResponseVariantDTO } from './response-variant.dto';

export const PromptResponseVariantWithPromptDTO = PromptResponseVariantDTO.extend({
  prompt: PromptDTO,
}).strict();

export type PromptResponseVariantWithPrompt = z.infer<typeof PromptResponseVariantWithPromptDTO>;

export const AnyResponseVariantWithDataDTO = z.union([JSONResponseVariantDTO, TextResponseVariantDTO]);

export type AnyResponseVariantWithData = z.infer<typeof AnyResponseVariantWithDataDTO>;
