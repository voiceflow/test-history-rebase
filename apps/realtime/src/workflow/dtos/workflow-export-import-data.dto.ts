import { WorkflowDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const WorkflowExportImportDataDTO = z
  .object({
    workflows: WorkflowDTO.array(),
  })
  .strict();

export type WorkflowExportImportDataDTO = z.infer<typeof WorkflowExportImportDataDTO>;
