import * as Realtime from '@voiceflow/realtime-sdk';
import { Normalized } from 'normal-store';

export interface ViewportState extends Normalized<Realtime.ViewportModel> {}
