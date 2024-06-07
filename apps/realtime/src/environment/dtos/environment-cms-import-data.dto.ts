import { z } from 'zod';

import { FunctionImportDataDTO } from '@/function/dtos/function-export-import-data.dto';
import { IntentImportDataDTO } from '@/intent/dtos/intent-import-data.dto';

import { EnvironmentCMSExportDataDTO } from './environment-cms-export-data.dto';

export const EnvironmentCMSImportDataDTO = EnvironmentCMSExportDataDTO
  .merge(IntentImportDataDTO.partial())
  .merge(FunctionImportDataDTO.partial());

export type EnvironmentCMSImportDataDTO = z.infer<typeof EnvironmentCMSImportDataDTO>;
