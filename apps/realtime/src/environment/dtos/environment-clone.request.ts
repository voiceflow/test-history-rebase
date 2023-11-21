import { VersionDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const EnvironmentCloneRequest = z
  .object({
    cloneDiagrams: z.boolean().optional(),
    targetEnvironmentID: z.string().optional(),
    targetVersionOverride: VersionDTO.omit({ _id: true }).partial().optional(),
    convertToLegacyFormat: z.boolean().optional(),
  })
  .strict();

export type EnvironmentCloneRequest = z.infer<typeof EnvironmentCloneRequest>;
