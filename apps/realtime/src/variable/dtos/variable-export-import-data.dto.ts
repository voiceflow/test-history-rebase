import { VariableDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const VariableExportImportDataDTO = z
  .object({
    variables: VariableDTO.array(),
  })
  .strict();

export type VariableExportImportDataDTO = z.infer<typeof VariableExportImportDataDTO>;
