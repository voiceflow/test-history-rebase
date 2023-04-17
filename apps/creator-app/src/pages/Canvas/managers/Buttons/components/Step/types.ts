import { BaseNode } from '@voiceflow/base-types';

export interface EntityPrompt {
  id: string;
  name: string;
  color: string;
  content: string;
}

export interface ButtonItem extends BaseNode.Buttons.Button {
  label: string;
  portID: string;
  prompts: EntityPrompt[];
  linkedLabel: string;
}
