import { z } from 'zod';

import { CMSBaseResourceDTO } from '@/common';
import { AnyCompiledConditionDTO } from '@/condition/compiled/condition.compiled.dto';

import { ResponseVariantType } from '../response-variant-type.enum';

export const BaseCompiledResponseVariantDTO = CMSBaseResourceDTO.extend({
  type: z.nativeEnum(ResponseVariantType),
  conditions: z.array(AnyCompiledConditionDTO).optional(),
  attachmentIDs: z.array(z.string()).optional(),
  data: z.unknown().optional(),
}).strict();
