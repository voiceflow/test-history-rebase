import type { z } from 'zod';

import { PromptDTO } from './prompt.dto';

export const PromptCreateDTO = PromptDTO.pick({ text: true, personaID: true }).strict();

export type PromptCreate = z.infer<typeof PromptCreateDTO>;
