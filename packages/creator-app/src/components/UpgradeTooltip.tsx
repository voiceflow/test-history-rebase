import { TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import { useStore } from '@/hooks';

export interface UpgradeTooltipData {
  title?: React.ReactNode;
  onUpgrade: (dispatch: ReturnType<typeof useStore>['dispatch']) => void;
  description: React.ReactNode;

  upgradeButtonText: string;
}

export interface UpgradeTooltipProps extends UpgradeTooltipData {
  tooltipProps?: Omit<TippyTooltipProps, 'title' | 'html' | 'interactive'>;
}

const UpgradeTooltip: React.FC<UpgradeTooltipProps> = ({ title, onUpgrade, children, description, tooltipProps, upgradeButtonText }) => {
  const store = useStore();

  return (
    <TippyTooltip
      position="right"
      bodyOverflow
      {...tooltipProps}
      interactive
      html={
        <TippyTooltip.FooterButton title={title} buttonText={upgradeButtonText} width={200} onClick={() => onUpgrade(store.dispatch)}>
          {description}
        </TippyTooltip.FooterButton>
      }
    >
      {children}
    </TippyTooltip>
  );
};

export default UpgradeTooltip;
