import { Constants } from '@voiceflow/general-types';

import { LinkData } from './Link';

export interface Port {
  id: string;
  nodeID: string;
  label: string | null;
  platform: Constants.PlatformType | null;
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
