import { BaseNode } from '@voiceflow/base-types';

import { EntityPrompt } from '@/pages/Canvas/types';

export interface ButtonItem extends BaseNode.Buttons.Button {
  label: string;
  portID: string;
  prompts: EntityPrompt[];
  linkedLabel: string;
}
