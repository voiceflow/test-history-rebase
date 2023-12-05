import { EntityDTO, EntityVariantDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const EntityExportImportDataDTO = z
  .object({
    entities: EntityDTO.array(),
    entityVariants: EntityVariantDTO.array(),
  })
  .strict();

export type EntityExportImportDataDTO = z.infer<typeof EntityExportImportDataDTO>;
