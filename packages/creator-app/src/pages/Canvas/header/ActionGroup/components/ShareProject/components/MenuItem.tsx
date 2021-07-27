import { PlanType } from '@voiceflow/internal';
import { Button, ButtonVariant, Link, stopImmediatePropagation, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import PlanBubble from '@/components/PlanBubble';
import { useEnableDisable } from '@/hooks';
import { Nullable } from '@/types';
import { copy } from '@/utils/clipboard';

import ButtonContainer from './ButtonContainer';
import Description from './Description';
import Header from './Header';
import LoadingButton from './LoadingButton';
import MenuItemContainer from './MenuItemContainer';

interface MenuItemProps {
  title: string;
  description: string;
  onRedirect: () => void;
  link: Nullable<string>;
  help?: string;
  isAllowed: boolean;
  track: () => void;
  loading?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, description, isAllowed, onRedirect, help, link, track, loading, onClick: onClickProp }) => {
  const [isCopied, setCopiedStatus, clearCopiedStatus] = useEnableDisable();

  const onCopy = React.useCallback(() => {
    copy(link);
    setCopiedStatus();
  }, [link]);

  const onClick = React.useCallback(() => {
    if (isAllowed) {
      onCopy();
    } else {
      onRedirect();
    }
    track();

    onClickProp?.();
  }, [isAllowed, track, onClickProp, onCopy]);

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(clearCopiedStatus, 1000);
    }
  }, [isCopied]);

  return (
    <MenuItemContainer onClick={stopImmediatePropagation()}>
      <div>
        <Header>
          <span>{title}</span>
          {!isAllowed && <PlanBubble plan={PlanType.PRO} />}
        </Header>
        <Description fontSize={13}>
          <span>{description} </span>
          {help && <Link href={help}>Learn More</Link>}
        </Description>
      </div>
      <ButtonContainer>
        {loading ? (
          <LoadingButton />
        ) : (
          <TippyTooltip title="Copied to clipboard" position="top" open={isCopied}>
            <Button variant={ButtonVariant.SECONDARY} onClick={stopImmediatePropagation(onClick)}>
              Copy
            </Button>
          </TippyTooltip>
        )}
      </ButtonContainer>
    </MenuItemContainer>
  );
};

export default MenuItem;
