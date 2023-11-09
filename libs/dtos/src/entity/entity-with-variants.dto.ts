import { z } from 'zod';

import { EntityDTO } from './entity.dto';
import { EntityVariantDTO } from './entity-variant/entity-variant.dto';

export const EntityWithVariantsDTO = EntityDTO.extend({
  variants: z.array(EntityVariantDTO),
}).strict();

export type EntityWithVariants = z.infer<typeof EntityWithVariantsDTO>;
