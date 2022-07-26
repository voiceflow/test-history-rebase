import { EntityPrompt } from '@/pages/Canvas/types';

export interface ChoiceItem {
  key: string;
  label: string;
  portID: string;
  prompts: EntityPrompt[];
}
