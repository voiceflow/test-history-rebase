import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { DialogType, HSLShades } from '@/constants';

export interface SpeakStepItem {
  id: string;
  url?: string;
  type: DialogType;
  content?: string | null;
  isLastItem?: boolean;
}

export interface AudioItem {
  id: string;
  url: string;
}

export interface SpeakStepProps {
  items: SpeakStepItem[];
  random?: boolean;
  nodeID: string;
  platform: VoiceflowConstants.PlatformType;
  palette: HSLShades;
  nextPortID: string;
  onOpenEditor: () => void;
}
