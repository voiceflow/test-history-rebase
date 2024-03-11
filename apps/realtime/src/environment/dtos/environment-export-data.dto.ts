import { DiagramDTO, VersionDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { EnvironmentCMSExportImportDataDTO } from './environment-cms-export-import-data.dto';

export const EnvironmentOnlyExportDTO = z
  .object({
    version: VersionDTO,
    diagrams: z.record(DiagramDTO),
  })
  .strict();

export const EnvironmentExportDTO = EnvironmentOnlyExportDTO.merge(EnvironmentCMSExportImportDataDTO.partial()).strict();

export type EnvironmentExportDTO = z.infer<typeof EnvironmentExportDTO>;
