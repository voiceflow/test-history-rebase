import * as Base from '@platform-config/configs/base';
import { VoiceModels } from '@voiceflow/voice-types';
import { Normalized } from 'normal-store';

export interface Prompt<Voice extends string = string> extends VoiceModels.IntentPrompt<Voice> {}

export interface SlotDialog<Voice extends string = string> extends Base.Models.Intent.SlotDialog {
  prompt: Prompt<Voice>[];
  confirm: Prompt<Voice>[];
}

export interface Slot<Voice extends string = string> extends Base.Models.Intent.Slot {
  dialog: SlotDialog<Voice>;
}

export interface Model<Voice extends string = string> extends Base.Models.Intent.Model {
  slots: Normalized<Slot<Voice>>;
}
