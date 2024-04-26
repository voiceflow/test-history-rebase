import type { BaseNode } from '@voiceflow/base-types';

import type { EntityPrompt } from '@/pages/Canvas/types';

export interface ButtonItem extends BaseNode.Buttons.Button {
  label: string;
  portID: string;
  prompts: EntityPrompt[];
  linkedLabel: string;
}
