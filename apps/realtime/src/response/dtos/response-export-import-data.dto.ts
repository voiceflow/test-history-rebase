import { AnyResponseAttachmentDTO, AnyResponseVariantDTO, ResponseDiscriminatorDTO, ResponseDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const ResponseExportImportDataDTO = z
  .object({
    responses: ResponseDTO.array(),
    responseVariants: AnyResponseVariantDTO.array(),
    responseAttachments: AnyResponseAttachmentDTO.array(),
    responseDiscriminators: ResponseDiscriminatorDTO.array(),
  })
  .strict();

export type ResponseExportImportDataDTO = z.infer<typeof ResponseExportImportDataDTO>;
