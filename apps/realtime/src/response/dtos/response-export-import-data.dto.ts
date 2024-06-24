import {
  AnyResponseAttachmentDTO,
  AnyResponseVariantDTO,
  ResponseDiscriminatorDTO,
  ResponseDTO,
  ResponseMessageDTO,
} from '@voiceflow/dtos';
import { z } from 'zod';

export const ResponseExportImportDataDTO = z
  .object({
    responses: ResponseDTO.array(),
    responseVariants: AnyResponseVariantDTO.array(),
    responseAttachments: AnyResponseAttachmentDTO.array(),
    responseDiscriminators: ResponseDiscriminatorDTO.array(),
    responseMessages: ResponseMessageDTO.array().optional(),
  })
  .strict();

export type ResponseExportImportDataDTO = z.infer<typeof ResponseExportImportDataDTO>;
