import type { z } from 'zod';

import { JSONResponseVariantDTO, PromptResponseVariantDTO, TextResponseVariantDTO } from './response-variant.dto';

export const JSONResponseVariantPatchDTO = JSONResponseVariantDTO.pick({ json: true, attachmentOrder: true })
  .strict()
  .partial();

export type JSONResponseVariantPatch = z.infer<typeof JSONResponseVariantPatchDTO>;

export const TextResponseVariantPatchDTO = TextResponseVariantDTO.pick({
  text: true,
  speed: true,
  cardLayout: true,
  attachmentOrder: true,
})
  .strict()
  .partial();

export type TextResponseVariantPatch = z.infer<typeof TextResponseVariantPatchDTO>;

export const PromptResponseVariantPatchDTO = PromptResponseVariantDTO.pick({
  turns: true,
  context: true,
  promptID: true,
  attachmentOrder: true,
})
  .strict()
  .partial();

export type PromptResponseVariantPatch = z.infer<typeof PromptResponseVariantPatchDTO>;
