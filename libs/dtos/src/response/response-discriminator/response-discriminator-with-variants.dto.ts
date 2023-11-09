import { z } from 'zod';

import { AnyResponseVariantWithDataDTO } from '../response-variant/response-variant-with-data.dto';
import { ResponseDiscriminatorDTO } from './response-discriminator.dto';

export const ResponseDiscriminatorWithVariantsDTO = ResponseDiscriminatorDTO.extend({
  variants: z.array(AnyResponseVariantWithDataDTO),
}).strict();

export type ResponseDiscriminatorWithVariants = z.infer<typeof ResponseDiscriminatorWithVariantsDTO>;
