import type { TippyTooltipProps } from '@voiceflow/ui';
import { TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { useStore } from '@/hooks/redux';

export interface UpgradeTooltipData extends React.PropsWithChildren {
  title?: React.ReactNode;
  onUpgrade: (dispatch: ReturnType<typeof useStore>['dispatch']) => void;
  description: React.ReactNode;
  upgradeButtonText: React.ReactNode;
}

export interface UpgradeTooltipProps extends UpgradeTooltipData {
  tooltipProps?: Omit<TippyTooltipProps, 'content' | 'interactive'>;
}

const UpgradeTooltip: React.FC<UpgradeTooltipProps> = ({
  title,
  onUpgrade,
  children,
  description,
  tooltipProps,
  upgradeButtonText,
}) => {
  const store = useStore();

  return (
    <TippyTooltip
      width={232}
      placement="right"
      {...tooltipProps}
      interactive
      content={
        <TippyTooltip.FooterButton
          title={title}
          buttonText={upgradeButtonText}
          onClick={() => onUpgrade(store.dispatch)}
        >
          {description}
        </TippyTooltip.FooterButton>
      }
    >
      {children}
    </TippyTooltip>
  );
};

export default UpgradeTooltip;
