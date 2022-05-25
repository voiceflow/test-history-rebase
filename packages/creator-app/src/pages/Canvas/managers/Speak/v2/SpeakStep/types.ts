import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { DialogType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';

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
  variant: BlockVariant;
  nextPortID: string;
  onOpenEditor: () => void;
}
