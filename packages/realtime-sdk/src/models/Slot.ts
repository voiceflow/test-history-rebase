import { Version } from '@voiceflow/general-types';

export interface SlotInput {
  id: string;
  value: string;
  synonyms: string;
}

export interface Slot {
  id: string;
  name: string;
  type: null | string;
  color?: string;
  inputs: SlotInput[];
}

export type DBSlot = Version.GeneralVersionData['slots'][number];
