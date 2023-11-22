import { z } from 'nestjs-zod/z';

import { VFFile } from '@/utils/vffile.interface';

export const Download = z.object({
  data: z.object({
    project: z.record(z.any()),
    version: z.record(z.any()),
    diagrams: z.record(z.record(z.any())),
    _version: z.number().optional(),
    variableStates: z.array(z.any()).optional(),
  }),
});

export type Download = Omit<z.infer<typeof Download>, 'data'> & {
  data: VFFile;
};
