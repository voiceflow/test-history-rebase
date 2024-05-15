import { z } from 'zod';

import { MediaDatatype } from '@/attachment/media-datatype.enum';

export const CompiledMediaAttachmentDataDTO = z.object({
  type: z.nativeEnum(MediaDatatype),
  url: z.string(),
});

export type CompiledMediaAttachmentData = z.infer<typeof CompiledMediaAttachmentDataDTO>;
