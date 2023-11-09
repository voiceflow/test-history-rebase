import type { Response } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'response';

export interface ResponseState extends Normalized<Response> {}
