import * as Realtime from '@voiceflow/realtime-sdk';

export type Domain = Realtime.Domain & { modified: number };
export type Domains = Domain[];
