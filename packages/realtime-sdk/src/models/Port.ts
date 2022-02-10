import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { LinkData } from './Link';

export interface Port {
  id: string;
  nodeID: string;
  label: string | null;
  platform: VoiceflowConstants.PlatformType | null;
  virtual: boolean;
  linkData?: LinkData;
}

export interface DBPort {
  id: string;
  parentNode: string;
  links?: string[];
  label?: string;
  in?: boolean;
  hidden?: boolean;
  virtual?: boolean;
  linkData?: LinkData;
}
