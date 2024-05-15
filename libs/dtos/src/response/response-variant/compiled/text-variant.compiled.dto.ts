import { z } from 'zod';

import { CardLayout } from '../card-layout.enum';
import { ResponseVariantType } from '../response-variant-type.enum';
import { BaseCompiledResponseVariantDTO } from './base-variant.compiled.dto';

export const CompiledTextResponseVariantDataDTO = z.object({
  text: z.string(),
  speed: z.number().nullable(),
  cardLayout: z.nativeEnum(CardLayout),
}).strict();

export type CompiledTextResponseVariantData = z.infer<typeof CompiledTextResponseVariantDataDTO>;

export const CompiledTextResponseVariantDTO = BaseCompiledResponseVariantDTO.extend({
  type: z.literal(ResponseVariantType.TEXT),
  data: CompiledTextResponseVariantDataDTO,
}).strict();

export type CompiledTextResponseVariant = z.infer<typeof CompiledTextResponseVariantDTO>;
