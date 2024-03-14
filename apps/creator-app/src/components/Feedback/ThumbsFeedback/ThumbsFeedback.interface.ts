import { PopperChildrenProps } from '@voiceflow/ui-next/build/cjs/components/Utility/Popper/Popper.interface';

export interface IThumbsFeedback {
  onBad?: VoidFunction;
  onGood?: VoidFunction;
  children?: (props: PopperChildrenProps & { onBadClick: VoidFunction }) => React.ReactNode;
}
