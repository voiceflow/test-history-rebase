import { PlatformType } from '@/constants';

export type Port = {
  id: string;
  nodeID: string;
  label: string | null;
  platform: PlatformType | null;
  virtual: boolean;
};

export type DBPort = {
  id: string;
  parentNode: string;
  links?: string[];
  label?: string;
  in?: boolean;
  hidden?: boolean;
  virtual?: boolean;
};
