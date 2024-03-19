import { PopperPlacement } from '@voiceflow/ui-next';

export interface ISectionHeaderTitleWithLearnTooltip {
  title: React.ReactNode;
  width?: number;
  children: React.ReactNode;
  className: string;
  placement?: PopperPlacement;
  onLearnClick: VoidFunction;
  offsetModifier?: [number, number];
  paddingModifier?: number;
}
