import { Skill } from '@/models';

export type SkillState = Skill & {
  meta: any;
  publishInfo: any;
  canvasExporting?: boolean;
};
