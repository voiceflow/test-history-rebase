import { z } from 'zod';

import { CMSBaseResourceDTO } from '@/common';
import { AnyCompiledConditionDTO } from '@/condition/compiled/condition.compiled.dto';

export const BaseCompiledResponseVariantDTO = CMSBaseResourceDTO.extend({
  conditions: z.array(AnyCompiledConditionDTO).optional(),
  data: z.unknown().optional(),
}).strict();
