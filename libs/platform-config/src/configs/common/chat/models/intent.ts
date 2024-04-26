import type * as Base from '@platform-config/configs/base';
import type { Normalized } from 'normal-store';

import type * as Prompt from './prompt';

export interface SlotDialog extends Base.Models.Intent.SlotDialog {
  prompt: Prompt.Model[];
  confirm: Prompt.Model[];
}

export interface Slot extends Base.Models.Intent.Slot {
  dialog: SlotDialog;
}

export interface Model extends Base.Models.Intent.Model {
  slots: Normalized<Slot>;
}
