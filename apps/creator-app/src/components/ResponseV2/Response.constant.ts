import { ResponseType } from '@voiceflow/dtos';

export const RESPONSE_TYPE_LABEL_MAP: Record<ResponseType, string> = {
  [ResponseType.MESSAGE]: 'Message',
  [ResponseType.PROMPT]: 'Prompt',
  [ResponseType.EMPTY]: '',
};
