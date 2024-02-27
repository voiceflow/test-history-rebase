import { z } from 'zod';

import { AttachmentExportImportDataDTO } from '@/attachment/dtos/attachment-export-import-data.dto';
import { EntityExportImportDataDTO } from '@/entity/dtos/entity-export-import-data.dto';
import { FlowExportImportDataDTO } from '@/flow/dtos/flow-export-import-data.dto';
import { FolderExportImportDataDTO } from '@/folder/dtos/folder-export-import-data.dto';
import { FunctionExportImportDataDTO } from '@/function/dtos/function-export-import-data.dto';
import { IntentExportImportDataDTO } from '@/intent/dtos/intent-export-import-data.dto';
import { ResponseExportImportDataDTO } from '@/response/dtos/response-export-import-data.dto';
import { VariableExportImportDataDTO } from '@/variable/dtos/variable-export-import-data.dto';

export const EnvironmentCMSExportImportDataDTO = z
  .object({})
  .merge(FlowExportImportDataDTO.partial())
  .merge(IntentExportImportDataDTO.partial())
  .merge(EntityExportImportDataDTO.partial())
  .merge(FolderExportImportDataDTO.partial())
  .merge(ResponseExportImportDataDTO.partial())
  .merge(FunctionExportImportDataDTO.partial())
  .merge(VariableExportImportDataDTO.partial())
  .merge(AttachmentExportImportDataDTO.partial());

export type EnvironmentCMSExportImportDataDTO = z.infer<typeof EnvironmentCMSExportImportDataDTO>;
