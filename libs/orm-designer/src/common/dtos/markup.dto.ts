import { MarkupDTO } from '@voiceflow/dtos';

import { ZodType } from './zod-type';

export const MarkupType = new ZodType(MarkupDTO);
