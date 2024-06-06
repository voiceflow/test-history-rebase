import { z } from 'zod';

import { MarkupDTO } from '@/common';

export const BaseNodeDataButtonDTO = z
  .object({
    label: MarkupDTO,
  })
  .strict();

export type BaseNodeDataButton = z.infer<typeof BaseNodeDataButtonDTO>;
