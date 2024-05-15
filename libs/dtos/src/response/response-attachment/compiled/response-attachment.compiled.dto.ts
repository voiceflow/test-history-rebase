import { z } from 'zod';

import { CompiledCardAttachmentDTO } from './card-attachment/card-attachment.compiled.dto';
import { CompiledMediaAttachmentDTO } from './media-attachment/media-attachment.compiled.dto';

export type { CompiledResponseCardAttachment } from './card-attachment/card-attachment.compiled.dto';
export type { CompiledResponseMediaAttachment } from './media-attachment/media-attachment.compiled.dto';

export const AnyCompiledResponseAttachmentDTO = z.union([CompiledCardAttachmentDTO, CompiledMediaAttachmentDTO]);

export type AnyCompiledResponseAttachment = z.infer<typeof AnyCompiledResponseAttachmentDTO>;
