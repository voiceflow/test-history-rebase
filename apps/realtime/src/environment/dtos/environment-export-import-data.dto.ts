import { DiagramDTO, VersionDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { zodDeepStrip } from '@/utils/zod-deep-strip.util';

import { EnvironmentCMSExportImportDataDTO } from './environment-cms-export-import-data.dto';

export const EnvironmentExportImportDTO = z
  .object({
    version: zodDeepStrip(VersionDTO),
    diagrams: z.record(zodDeepStrip(DiagramDTO.extend({ diagramID: z.string().optional() }))),
  })
  .merge(EnvironmentCMSExportImportDataDTO.partial());

export type EnvironmentExportImportDTO = z.infer<typeof EnvironmentExportImportDTO>;
