import type * as Realtime from '@voiceflow/realtime-sdk';
import type { Normalized } from 'normal-store';

export interface ViewportState extends Normalized<Realtime.ViewportModel> {}
