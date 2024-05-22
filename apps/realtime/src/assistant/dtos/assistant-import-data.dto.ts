import { ProjectDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { EnvironmentImportDTO } from '@/environment/dtos/environment-import-data.dto';
import { zodDeepStrip } from '@/utils/zod-deep-strip.util';

import { AssistantOnlyExportDataDTO } from './assistant-export-data.dto';

export const AssistantImportDataDTO = zodDeepStrip(
  AssistantOnlyExportDataDTO.extend({
    // we don't care about the prototype cause it's not used in the import
    project: ProjectDTO.extend({ prototype: z.any().optional() }),
  })
).merge(EnvironmentImportDTO);

export type AssistantImportDataDTO = z.infer<typeof AssistantImportDataDTO>;
