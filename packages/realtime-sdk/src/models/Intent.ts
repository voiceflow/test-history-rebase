import { PlatformType } from '@voiceflow/internal';

import { Normalized } from '../types';

export interface IntentInput {
  text: string;
  voice?: string;
  slots?: string[];
}

export interface IntentSlotDialog {
  confirm: IntentInput[];
  utterances: IntentInput[];
  confirmEnabled: boolean;
  prompt: IntentInput[];
}

export interface IntentSlot {
  id: string;
  dialog: IntentSlotDialog;
  required: boolean;
}

export interface Intent {
  id: string;
  name: string;
  slots: Normalized<IntentSlot>;
  inputs: IntentInput[];
  platform: PlatformType;
}
