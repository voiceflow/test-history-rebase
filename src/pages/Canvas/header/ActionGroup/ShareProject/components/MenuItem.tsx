import React from 'react';

import BubbleText from '@/components/BubbleText';
import Button, { ButtonVariant } from '@/components/Button';
import { Link } from '@/components/Text';
import Tooltip from '@/components/TippyTooltip';
import { PlanType } from '@/constants';
import { useEnableDisable } from '@/hooks';
import { copy } from '@/utils/clipboard';
import { stopImmediatePropagation } from '@/utils/dom';

import ButtonContainer from './ButtonContainer';
import Description from './Description';
import Header from './Header';
import MenuItemContainer from './MenuItemContainer';

type MenuItemProps = {
  title: string;
  description: string;
  onRedirect: () => void;
  link: string | boolean;
  help: string;
  plan: PlanType | null;
  track: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({ title, description, plan, onRedirect, help, link, track }) => {
  const [isCopied, setCopiedStatus, clearCopiedStatus] = useEnableDisable();

  const onCopy = React.useCallback(() => {
    copy(link);
    setCopiedStatus();
  }, []);

  const onClick = React.useCallback(() => {
    if (plan !== PlanType.STARTER) {
      onCopy();
    } else {
      onRedirect();
    }
    track();
  }, [plan, track]);

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
          {plan === PlanType.STARTER && <BubbleText color="green">Pro</BubbleText>}
        </Header>
        <Description>
          <span>{description} </span>
          <Link href={help}>Learn More</Link>
        </Description>
      </div>
      <ButtonContainer>
        <Tooltip title="Copied to clipboard" position="top" open={isCopied}>
          <Button variant={ButtonVariant.SECONDARY} onClick={stopImmediatePropagation(onClick)}>
            Copy
          </Button>
        </Tooltip>
      </ButtonContainer>
    </MenuItemContainer>
  );
};

export default MenuItem;
