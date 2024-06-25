import { z } from 'zod';

import { SlateTextValueDTO } from '@/text/text.dto';

import { CardLayout } from '../card-layout.enum';
import { ResponseVariantType } from '../response-variant-type.enum';
import { BaseCompiledResponseVariantDTO } from './base-variant.compiled.dto';

export const CompiledTextResponseVariantDataDTO = z
  .object({
    text: SlateTextValueDTO,
    speed: z.number().nullable(),
    cardLayout: z.nativeEnum(CardLayout),
  })
  .strict();

export type CompiledTextResponseVariantData = z.infer<typeof CompiledTextResponseVariantDataDTO>;

export const CompiledTextResponseVariantDTO = BaseCompiledResponseVariantDTO.extend({
  type: z.literal(ResponseVariantType.TEXT),
  data: CompiledTextResponseVariantDataDTO,
}).strict();

export type CompiledTextResponseVariant = z.infer<typeof CompiledTextResponseVariantDTO>;
