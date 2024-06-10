import { Enum } from '@/utils/type/enum.util';

export const ResponseType = {
  PROMPT: 'prompt',
  TEXT: 'text',
} as const;

export type ResponseType = Enum<typeof ResponseType>;
