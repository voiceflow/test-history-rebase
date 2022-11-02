import * as Common from '@platform/configs/common';
import { AlexaConstants } from '@voiceflow/alexa-types';
import { Normalized } from 'normal-store';

export interface Prompt extends Common.Voice.Models.Intent.Prompt {
  voice?: AlexaConstants.Voice;
}

export interface SlotDialog extends Common.Voice.Models.Intent.SlotDialog {
  prompt: Prompt[];
  confirm: Prompt[];
}

export interface Slot extends Common.Voice.Models.Intent.Slot {
  dialog: SlotDialog;
}

export interface Model extends Common.Voice.Models.Intent.Model {
  slots: Normalized<Slot>;
}
