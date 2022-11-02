import * as Base from '@platform/configs/base';
import { ChatModels } from '@voiceflow/chat-types';
import { Normalized } from 'normal-store';

export interface SlotDialog extends Base.Models.Intent.SlotDialog {
  prompt: ChatModels.Prompt[];
  confirm: ChatModels.Prompt[];
}

export interface Slot extends Base.Models.Intent.Slot {
  dialog: SlotDialog;
}

export interface Model extends Base.Models.Intent.Model {
  slots: Normalized<Slot>;
}
