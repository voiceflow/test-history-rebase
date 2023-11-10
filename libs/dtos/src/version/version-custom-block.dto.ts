import { z } from 'zod';

export const VersionCustomBlockParameterDTO = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .strict();

export type VersionCustomBlockParameter = z.infer<typeof VersionCustomBlockParameterDTO>;

export const VersionCustomBlockDTO = z
  .object({
    key: z.string(),
    name: z.string(),
    body: z.string().optional(),
    stop: z.boolean().optional(),
    paths: z.array(z.string()).optional(),
    parameters: z.record(VersionCustomBlockParameterDTO).optional(),
    defaultPath: z.number().optional(),
  })
  .strict();

export type VersionCustomBlock = z.infer<typeof VersionCustomBlockDTO>;
