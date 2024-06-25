import type { PopperChildrenProps } from '@voiceflow/ui-next/build/cjs/components/Utility/Popper/Popper.interface';

export interface IThumbsFeedback {
  onBad?: VoidFunction;
  onGood?: VoidFunction;
  children?: (props: PopperChildrenProps & { onBadClick: VoidFunction }) => React.ReactNode;
}

export interface IThumbsFeedbackButton {
  type: 'bad' | 'good';
  onClick: VoidFunction;
  voteType: 'good' | 'bad' | null;
  isActive?: boolean;
}
