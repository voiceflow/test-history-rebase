import { z } from 'zod';

import { EnvironmentImportDTO } from './environment-import-data.dto';

export const EnvironmentCloneRequest = z
  .object({
    cloneDiagrams: z.boolean().optional(),
    targetEnvironmentID: z.string().optional(),
    targetVersionOverride: EnvironmentImportDTO.shape.version.omit({ _id: true }).partial().optional(),
    convertToLegacyFormat: z.boolean().optional(),
  })
  .strict();

export type EnvironmentCloneRequest = z.infer<typeof EnvironmentCloneRequest>;
