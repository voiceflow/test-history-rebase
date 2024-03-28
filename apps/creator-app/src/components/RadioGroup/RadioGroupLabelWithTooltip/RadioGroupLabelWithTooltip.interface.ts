import { PopperPlacement } from '@voiceflow/ui-next';

export interface IRadioGroupLabelWithTooltip {
  label: string;
  width?: number;
  children: React.ReactNode;
  placement?: PopperPlacement;
  onLearnClick: VoidFunction;
  offsetModifier?: [number, number];
  paddingModifier?: number;
}
