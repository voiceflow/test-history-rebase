import { PlatformType } from '@/constants';
import { Skill } from '@/models';
import { Nullable } from '@/types';

export type SkillState<L extends string> = Skill<L> & {
  meta: any;
  publishInfo: Nullable<Record<PlatformType, any>>;
  canvasExporting?: boolean;
  modelExporting?: boolean;
};
