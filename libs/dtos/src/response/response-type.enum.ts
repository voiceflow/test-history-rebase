import { Enum } from '@/utils/type/enum.util';

export const ResponseType = {
  PROMPT: 'prompt',
  MESSAGE: 'message',
  EMPTY: 'empty',
} as const;

export type ResponseType = Enum<typeof ResponseType>;
