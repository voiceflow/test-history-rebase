import { Utils } from '@voiceflow/common';
import { Button, Popper, PopperTypes, SvgIcon, SvgIconTypes, useSetup } from '@voiceflow/ui';
import React from 'react';

import { UpgradePrompt } from '@/ducks/tracking';
import { useStore } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';

import * as S from './styles';

export interface UpgradePopperData {
  icon?: SvgIconTypes.Icon;
  title: React.ReactNode;
  onUpgrade: (dispatch: ReturnType<typeof useStore>['dispatch']) => void;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
  description: React.ReactNode;
  upgradePrompt?: UpgradePrompt;
  upgradeButtonText: React.ReactNode;
}

export interface UpgradePopperProps extends UpgradePopperData {
  children: PopperTypes.Props['children'];
  popperProps?: Omit<PopperTypes.Props, 'children' | 'renderContent'>;
}

const UpgradePopper = React.forwardRef<HTMLDivElement, UpgradePopperProps>(
  (
    {
      icon = 'skillTemplate',
      title,
      children,
      popperProps,
      onUpgrade,
      iconProps,
      description,
      upgradePrompt,
      upgradeButtonText,
    },
    ref
  ) => {
    const store = useStore();

    const [trackingEvents] = useTrackingEvents();

    useSetup(() => {
      if (upgradePrompt) {
        trackingEvents.trackUpgradePrompt({ promptType: upgradePrompt });
      }
    });

    return (
      <Popper
        placement="right-start"
        portalNode={document.body}
        {...popperProps}
        renderContent={({ onClose }) => (
          <S.Container ref={ref}>
            <S.IconContainer>
              <SvgIcon icon={icon} size={80} {...iconProps} />
            </S.IconContainer>

            <S.Title>{title}</S.Title>

            <S.Description>{description}</S.Description>

            <Button
              variant={Button.Variant.PRIMARY}
              onClick={Utils.functional.chainVoid(onClose, () => onUpgrade(store.dispatch))}
              squareRadius
            >
              {upgradeButtonText}
            </Button>
          </S.Container>
        )}
      >
        {children}
      </Popper>
    );
  }
);

export default UpgradePopper;
