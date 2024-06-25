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
    responseMessages: ResponseMessageDTO.array().optional(),
    responseVariants: AnyResponseVariantDTO.array(),
    responseAttachments: AnyResponseAttachmentDTO.array(),
    responseDiscriminators: ResponseDiscriminatorDTO.array(),
  })
  .strict();

export type ResponseExportImportDataDTO = z.infer<typeof ResponseExportImportDataDTO>;
