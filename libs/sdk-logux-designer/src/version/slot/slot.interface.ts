export interface SlotType {
  value?: string;
}
export interface Slot {
  key: string;
  name: string;
  type: SlotType;
  color?: string;
  inputs: string[];
}
