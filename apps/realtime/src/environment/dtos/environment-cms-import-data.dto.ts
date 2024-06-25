import type { z } from 'zod';

import { FunctionImportDataDTO } from '@/function/dtos/function-import-data.dto';
import { IntentImportDataDTO } from '@/intent/dtos/intent-import-data.dto';

import { EnvironmentCMSExportDataDTO } from './environment-cms-export-data.dto';

export const EnvironmentCMSImportDataDTO = EnvironmentCMSExportDataDTO.extend({
  ...IntentImportDataDTO.partial().shape,
  ...FunctionImportDataDTO.partial().shape,
});

export type EnvironmentCMSImportDataDTO = z.infer<typeof EnvironmentCMSImportDataDTO>;
