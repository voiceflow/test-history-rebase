import { FolderDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const FolderExportImportDataDTO = z
  .object({
    folders: FolderDTO.array(),
  })
  .strict();

export type FolderExportImportDataDTO = z.infer<typeof FolderExportImportDataDTO>;
