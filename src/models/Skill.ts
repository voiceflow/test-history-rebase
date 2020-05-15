import { PlatformType } from '@/constants';

import { DBIntent } from './Intent';
import { DBSlot } from './Slot';

export type Skill = {
  name: string;
  id: string;
  locales: string[];
  creatorID: number;
  projectID: string;
  rootDiagramID: string;
  diagramID: string;
  platform: PlatformType;
  globalVariables: string[];
};

export type DBSkill = {
  name: string;
  skill_id: string;
  creator_id: number;
  project_id: string;
  diagram: string;
  platform: PlatformType;
  live: boolean;
  review: boolean;
  locales: string[];
  google_publish_info: unknown;
  global?: string[];
  amzn_id?: string;
  vendor_id: string | null;
  google_id: string | null;
  intents: DBIntent[];
  slots: DBSlot[];
};

export type ToDBSkill = Omit<DBSkill, 'intents' | 'slots'> & {
  intents: string;
  slots: string;
};
