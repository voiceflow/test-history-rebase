import type { z } from 'zod';

import { CMSTabularResourceDTO, MarkupDTO } from '@/common';

import { PromptSettingsDTO } from './prompt-settings.dto';

export const PromptDTO = CMSTabularResourceDTO.extend({
  text: MarkupDTO,
  settings: PromptSettingsDTO.nullable(),
}).strict();

export type Prompt = z.infer<typeof PromptDTO>;
