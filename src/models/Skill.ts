import { PlatformType } from '@/constants';

export type Skill = {};

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
};
