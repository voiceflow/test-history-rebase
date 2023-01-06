import { TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import { useStore } from '@/hooks/redux';

export interface UpgradeTooltipData {
  title?: React.ReactNode;
  onUpgrade: (dispatch: ReturnType<typeof useStore>['dispatch']) => void;
  description: React.ReactNode;

  upgradeButtonText: string;
}

export interface UpgradeTooltipProps extends UpgradeTooltipData {
  tooltipProps?: Omit<TippyTooltipProps, 'content' | 'interactive'>;
}

const UpgradeTooltip: React.OldFC<UpgradeTooltipProps> = ({ title, onUpgrade, children, description, tooltipProps, upgradeButtonText }) => {
  const store = useStore();

  return (
    <TippyTooltip
      placement="right"
      width={232}
      {...tooltipProps}
      interactive
      content={
        <TippyTooltip.FooterButton title={title} buttonText={upgradeButtonText} onClick={() => onUpgrade(store.dispatch)}>
          {description}
        </TippyTooltip.FooterButton>
      }
    >
      {children}
    </TippyTooltip>
  );
};

export default UpgradeTooltip;
