import type { ResponseMessage } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'message';

export interface ResponseMessageState extends Normalized<ResponseMessage> {}
