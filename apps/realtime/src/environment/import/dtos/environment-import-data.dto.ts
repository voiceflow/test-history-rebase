import { DiagramDTO, VersionDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { zodDeepStrip } from '@/utils/zod-deep-strip.util';

import { EnvironmentCMSExportImportDataDTO } from '../../export/dtos/environment-cms-export-import-data.dto';
import { EnvironmentOnlyExportDTO } from '../../export/dtos/environment-export-data.dto';

export const EnvironmentImportDTO = zodDeepStrip(
  EnvironmentOnlyExportDTO.extend({
    // TODO: validate if we can import version with real prototype DTO
    version: VersionDTO.extend({ prototype: z.record(z.any()).optional() }),
    diagrams: z.record(DiagramDTO.extend({ diagramID: z.string().optional() })),
  })
).merge(EnvironmentCMSExportImportDataDTO.partial());

export type EnvironmentImportDTO = z.infer<typeof EnvironmentImportDTO>;
