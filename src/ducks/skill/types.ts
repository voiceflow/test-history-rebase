import { PlatformType } from '@/constants';
import { FullSkill, Skill } from '@/models';
import { Nullable } from '@/types';

export type SkillState = Skill & {
  meta: FullSkill['meta'];
  publishInfo: Nullable<Record<PlatformType, any>>;
  canvasExporting?: boolean;
};
