import { z } from 'zod';

import { CompiledMessageDTO } from '@/response/message.compiled.dto';

export const VersionProgramResourcesDTO = z.object({
  messages: z.record(CompiledMessageDTO),
});

export type VersionProgramResources = z.infer<typeof VersionProgramResourcesDTO>;
