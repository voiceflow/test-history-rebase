import { z } from 'zod';

export const AIPromptWrapperDTO = z.object({ content: z.string() });

export type AIPromptWrapper = z.infer<typeof AIPromptWrapperDTO>;
