import { z } from 'zod';

import { AttachmentExportImportDataDTO } from '@/attachment/dtos/attachment-export-import-data.dto';
import { EntityExportImportDataDTO } from '@/entity/dtos/entity-export-import-data.dto';
import { FlowExportImportDataDTO } from '@/flow/dtos/flow-export-import-data.dto';
import { FolderExportImportDataDTO } from '@/folder/dtos/folder-export-import-data.dto';
import { FunctionExportDataDTO } from '@/function/dtos/function-export-import-data.dto';
import { IntentExportDataDTO } from '@/intent/dtos/intent-export-data.dto';
import { ResponseExportImportDataDTO } from '@/response/dtos/response-export-import-data.dto';
import { VariableExportImportDataDTO } from '@/variable/dtos/variable-export-import-data.dto';
import { WorkflowExportImportDataDTO } from '@/workflow/dtos/workflow-export-import-data.dto';

export const EnvironmentCMSExportDataDTO = z
  .object({})
  .merge(FlowExportImportDataDTO.partial())
  .merge(IntentExportDataDTO.partial())
  .merge(EntityExportImportDataDTO.partial())
  .merge(FolderExportImportDataDTO.partial())
  .merge(ResponseExportImportDataDTO.partial())
  .merge(FunctionExportDataDTO.partial())
  .merge(VariableExportImportDataDTO.partial())
  .merge(WorkflowExportImportDataDTO.partial())
  .merge(AttachmentExportImportDataDTO.partial());

export type EnvironmentCMSExportDataDTO = z.infer<typeof EnvironmentCMSExportDataDTO>;
