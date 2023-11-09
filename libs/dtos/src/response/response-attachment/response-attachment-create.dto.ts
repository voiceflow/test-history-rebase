import { z } from 'zod';

import { ResponseCardAttachmentDRO, ResponseMediaAttachmentDRO } from './response-attachment.dto';

// create data

export const ResponseCardAttachmentCreateDTO = ResponseCardAttachmentDRO.pick({ type: true, cardID: true }).strict();

export type ResponseCardAttachmentCreate = z.infer<typeof ResponseCardAttachmentCreateDTO>;

export const ResponseMediaAttachmentCreateDTO = ResponseMediaAttachmentDRO.pick({ type: true, mediaID: true }).strict();

export type ResponseMediaAttachmentCreate = z.infer<typeof ResponseMediaAttachmentCreateDTO>;

export const AnyResponseAttachmentCreateDTO = z.union([
  ResponseCardAttachmentCreateDTO,
  ResponseMediaAttachmentCreateDTO,
]);

export type AnyResponseAttachmentCreate = z.infer<typeof AnyResponseAttachmentCreateDTO>;
