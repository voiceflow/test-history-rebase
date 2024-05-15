import { z } from 'zod';

import { CompiledResponseDTO } from '@/response/response.compiled.dto';
import { AnyCompiledResponseAttachmentDTO } from '@/response/response-attachment/compiled/response-attachment.compiled.dto';

export const VersionProgramResourcesDTO = z.object({
  attachments: z.record(AnyCompiledResponseAttachmentDTO),
  responses: z.record(CompiledResponseDTO),
});

export type VersionProgramResources = z.infer<typeof VersionProgramResourcesDTO>;
