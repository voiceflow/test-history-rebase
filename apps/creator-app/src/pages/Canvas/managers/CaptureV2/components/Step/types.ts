import type * as Platform from '@voiceflow/platform-config';
import type * as Realtime from '@voiceflow/realtime-sdk';

import type { EntityPrompt } from '@/pages/Canvas/types';

export interface CaptureSlot extends Platform.Base.Models.Intent.Slot {
  slot?: Realtime.Slot;
  prompt?: EntityPrompt | null;
}
