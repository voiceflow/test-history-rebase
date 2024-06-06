import { z } from 'zod';

import { IntentImportDataDTO } from '@/intent/dtos/intent-import-data.dto';

import { EnvironmentCMSExportDataDTO } from './environment-cms-export-data.dto';

export const EnvironmentCMSImportDataDTO = EnvironmentCMSExportDataDTO.merge(IntentImportDataDTO.partial());

export type EnvironmentCMSImportDataDTO = z.infer<typeof EnvironmentCMSImportDataDTO>;
