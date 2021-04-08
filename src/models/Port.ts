import { PlatformType } from '@/constants';

import { LinkData } from './Link';

export type Port = {
  id: string;
  nodeID: string;
  label: string | null;
  platform: PlatformType | null;
  virtual: boolean;
  linkData?: LinkData;
};

export type DBPort = {
  id: string;
  parentNode: string;
  links?: string[];
  label?: string;
  in?: boolean;
  hidden?: boolean;
  virtual?: boolean;
  linkData?: LinkData;
};
