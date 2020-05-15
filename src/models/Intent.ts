import { PlatformType } from '@/constants';
import { Normalized } from '@/utils/normalized';

export type IntentInput = {
  text: string;
  slots?: string[];
};

export type IntentSlotDialog = {
  confirm: IntentInput[];
  utterances: IntentInput[];
  confirmEnabled: boolean;
  prompt: IntentInput[];
};

export type IntentSlot = {
  id: string;
  dialog: IntentSlotDialog;
  required: boolean;
};

export type Intent = {
  id: string;
  name: string;
  slots: Normalized<IntentSlot>;
  inputs: IntentInput[];
  builtIn?: boolean;
  platform: PlatformType;
};

export type DBIntent = {
  key: string;
  name: string;
  slots?: IntentSlot[];
  inputs: IntentInput[];
  _platform: PlatformType;
};
