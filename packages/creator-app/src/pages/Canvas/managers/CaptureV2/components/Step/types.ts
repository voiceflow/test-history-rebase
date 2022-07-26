import * as Realtime from '@voiceflow/realtime-sdk';

import { EntityPrompt } from '@/pages/Canvas/types';

export type CaptureSlot = Realtime.IntentSlot & { slot?: Realtime.Slot; prompt?: EntityPrompt | null };
