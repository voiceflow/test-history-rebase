import { DiagramDTO, VersionDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { EnvironmentCMSExportDataDTO } from './environment-cms-export-data.dto';

export const EnvironmentOnlyExportDTO = z
  .object({
    version: VersionDTO,
    diagrams: z.record(DiagramDTO),
  })
  .strict();

export const EnvironmentExportDTO = EnvironmentOnlyExportDTO.merge(EnvironmentCMSExportDataDTO.partial()).strict();

export type EnvironmentExportDTO = z.infer<typeof EnvironmentExportDTO>;
