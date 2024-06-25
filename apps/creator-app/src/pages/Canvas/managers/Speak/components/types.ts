import type * as Realtime from '@voiceflow/realtime-sdk';

import type { HSLShades } from '@/constants';

export interface BaseStepProps {
  palette: HSLShades;
  nextPortID: string | null;
  onOpenEditor: VoidFunction;
  attachmentItems: Realtime.SpeakData[];
}
