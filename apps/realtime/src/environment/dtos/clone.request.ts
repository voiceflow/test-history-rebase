import { VersionDTO } from '@voiceflow/dtos';
import { z } from 'nestjs-zod/z';

export const CloneRequest = z
  .object({
    cloneDiagrams: z.boolean().optional(),
    targetEnvironmentID: z.string().optional(),
    targetVersionOverride: VersionDTO.omit({ _id: true }).partial().optional(),
    convertToLegacyFormat: z.boolean().optional(),
  })
  .strict();

export type CloneRequest = z.infer<typeof CloneRequest>;
