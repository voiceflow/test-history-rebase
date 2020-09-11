import { PlatformType } from '@/constants';
import { Skill } from '@/models';
import { Nullable } from '@/types';

export type SkillState = Skill & {
  meta: any;
  publishInfo: Nullable<Record<PlatformType, any>>;
  canvasExporting?: boolean;
};
