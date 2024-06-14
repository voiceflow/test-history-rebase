import { DiagramDTO, VersionDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { zodDeepStrip } from '@/utils/zod-deep-strip.util';

import { EnvironmentCMSImportDataDTO } from './environment-cms-import-data.dto';
import { EnvironmentOnlyExportDTO } from './environment-export-data.dto';

export const EnvironmentImportDTO = zodDeepStrip(
  EnvironmentOnlyExportDTO.extend({
    // TODO: validate if we can import version with real prototype DTO
    version: VersionDTO.extend({ prototype: z.record(z.any()).optional() }),
    diagrams: z.record(DiagramDTO.extend({ diagramID: z.string().optional() })),
  })
).merge(EnvironmentCMSImportDataDTO.partial());

export type EnvironmentImportDTO = z.infer<typeof EnvironmentImportDTO>;
