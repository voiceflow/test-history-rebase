import * as Realtime from '@voiceflow/realtime-sdk';

import { HSLShades } from '@/constants';

export interface BaseStepProps {
  palette: HSLShades;
  nextPortID: string | null;
  onOpenEditor: VoidFunction;
  attachmentItems: Realtime.SpeakData[];
}
