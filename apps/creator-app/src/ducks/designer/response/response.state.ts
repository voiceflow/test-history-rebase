import type { Response } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'response';

export interface ResponseState extends Normalized<Response> {}
