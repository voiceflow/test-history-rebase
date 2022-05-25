import { BaseNode } from '@voiceflow/base-types';

export interface EntityPrompt {
  id: string;
  name: string;
  content: string;
  color: string;
}

export interface ButtonItem extends BaseNode.Buttons.Button {
  portID: string | null;
  label: string | null;
  prompts: EntityPrompt[];
  linkedLabel: string | null;
  withRequiredEntitiesAttachment: boolean;
  withLinkedLabelsAttachment: boolean;
  onGoToLinkedIntent: () => void;
}
