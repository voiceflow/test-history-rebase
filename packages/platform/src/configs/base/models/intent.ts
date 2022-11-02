import { BaseModels } from '@voiceflow/base-types';
import { Normalized } from 'normal-store';

export interface Slot extends BaseModels.IntentSlot {}
export interface Input extends BaseModels.IntentInput {}
export interface SlotDialog extends BaseModels.IntentSlotDialog {}

export interface Model {
  id: string;
  name: string;
  slots: Normalized<Slot>;
  inputs: Input[];
  noteID?: string;
}
