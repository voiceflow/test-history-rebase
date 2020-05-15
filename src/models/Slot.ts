export type SlotInput = {
  id: string;
  value: string;
  synonyms: string;
};

export type Slot = {
  id: string;
  name: string;
  type: null | string;
  color?: string;
  inputs: SlotInput[];
};

export type DBSlot = {
  key: string;
  name: string;
  type?: { value?: string };
  color?: string;
  inputs: string[];
};
