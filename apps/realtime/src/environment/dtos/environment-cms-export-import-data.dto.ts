import { z } from 'zod';

import { AttachmentExportImportDataDTO } from '@/attachment/dtos/attachment-export-import-data.dto';
import { EntityExportImportDataDTO } from '@/entity/dtos/entity-export-import-data.dto';
import { FunctionExportImportDataDTO } from '@/function/dtos/function-export-import-data.dto';
import { IntentExportImportDataDTO } from '@/intent/dtos/intent-export-import-data.dto';
import { ResponseExportImportDataDTO } from '@/response/dtos/response-export-import-data.dto';

export const EnvironmentCMSExportImportDataDTO = z
  .object({})
  .merge(IntentExportImportDataDTO.partial())
  .merge(EntityExportImportDataDTO.partial())
  .merge(ResponseExportImportDataDTO.partial())
  .merge(FunctionExportImportDataDTO.partial())
  .merge(AttachmentExportImportDataDTO.partial());

export type EnvironmentCMSExportImportDataDTO = z.infer<typeof EnvironmentCMSExportImportDataDTO>;
