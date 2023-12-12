import { AnyAttachmentDTO, CardButtonDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const AttachmentExportImportDataDTO = z
  .object({
    attachments: AnyAttachmentDTO.array(),
    cardButtons: CardButtonDTO.array(),
  })
  .strict();

export type AttachmentExportImportDataDTO = z.infer<typeof AttachmentExportImportDataDTO>;
