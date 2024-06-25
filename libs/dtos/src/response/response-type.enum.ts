import type { Enum } from '@/utils/type/enum.util';

export const ResponseType = {
  PROMPT: 'prompt',
  MESSAGE: 'message',
} as const;

export type ResponseType = Enum<typeof ResponseType>;
