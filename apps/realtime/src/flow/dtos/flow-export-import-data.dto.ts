import { FlowDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const FlowExportImportDataDTO = z
  .object({
    flows: FlowDTO.array(),
  })
  .strict();

export type FlowExportImportDataDTO = z.infer<typeof FlowExportImportDataDTO>;
