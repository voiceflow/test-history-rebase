import { Skill } from '@/models';

export type SkillState<L extends string> = Skill<L> & {
  meta: any;
  canvasExporting?: boolean;
  modelExporting?: boolean;
};
