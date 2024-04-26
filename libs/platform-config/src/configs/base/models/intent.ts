import type { BaseModels } from '@voiceflow/base-types';
import type { Normalized } from 'normal-store';

export interface Input extends BaseModels.IntentInput {}

export interface SlotDialog extends BaseModels.IntentSlotDialog {}

export interface Slot extends BaseModels.IntentSlot {
  dialog: SlotDialog;
}

export interface Model {
  id: string;
  name: string;
  slots: Normalized<Slot>;
  inputs: Input[];
  noteID?: string;
}
