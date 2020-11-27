import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import PlanBubble from '@/components/PlanBubble';
import { Link } from '@/components/Text';
import Tooltip from '@/components/TippyTooltip';
import { FeatureFlag } from '@/config/features';
import { PlanType } from '@/constants';
import { useEnableDisable, useFeature } from '@/hooks';
import { Nullable } from '@/types';
import { copy } from '@/utils/clipboard';
import { stopImmediatePropagation } from '@/utils/dom';

import ButtonContainer from './ButtonContainer';
import Description from './Description';
import Header from './Header';
import LoadingButton from './LoadingButton';
import MenuItemContainer from './MenuItemContainer';

type MenuItemProps = {
  title: string;
  description: string;
  onRedirect: () => void;
  link: Nullable<string>;
  help?: string;
  isAllowed: boolean;
  track: () => void;
  loading?: boolean;
  onClick?: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({ title, description, isAllowed, onRedirect, help, link, track, loading, onClick: onClickProp }) => {
  const [isCopied, setCopiedStatus, clearCopiedStatus] = useEnableDisable();
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);

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
    <MenuItemContainer oldHeader={!headerRedesign.isEnabled} onClick={stopImmediatePropagation()}>
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
          <LoadingButton iconProps={{ spin: true, size: 20 }} variant={ButtonVariant.SECONDARY} icon="publishSpin" square />
        ) : (
          <Tooltip title="Copied to clipboard" position="top" open={isCopied}>
            <Button variant={ButtonVariant.SECONDARY} onClick={stopImmediatePropagation(onClick)}>
              Copy
            </Button>
          </Tooltip>
        )}
      </ButtonContainer>
    </MenuItemContainer>
  );
};

export default MenuItem;
