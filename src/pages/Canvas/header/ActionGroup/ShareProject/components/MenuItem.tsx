import React from 'react';

import Badge from '@/components/Badge';
import Button, { ButtonVariant } from '@/components/Button';
import { Link } from '@/components/Text';
import Tooltip from '@/components/TippyTooltip';
import { PlanType } from '@/constants';
import { useEnableDisable } from '@/hooks';
import { copy } from '@/utils/clipboard';
import { stopImmediatePropagation } from '@/utils/dom';

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
};

const MenuItem: React.FC<MenuItemProps> = ({ title, description, plan, onRedirect, help, link }) => {
  const [isCopied, setCopiedStatus, clearCopiedStatus] = useEnableDisable();

  const onCopy = React.useCallback(() => {
    copy(link);
    setCopiedStatus();
  }, []);

  const button = (
    <Button variant={ButtonVariant.SECONDARY} onClick={stopImmediatePropagation(plan ? onCopy : onRedirect)}>
      Copy
    </Button>
  );

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
          {!plan && <Badge color="green">Pro</Badge>}
        </Header>
        <Description>
          <span>{description} </span>
          <Link href={help}>Learn More</Link>
        </Description>
      </div>
      <div>
        {isCopied ? (
          <Tooltip title="Copied to clipboard" position="top">
            {button}
          </Tooltip>
        ) : (
          button
        )}
      </div>
    </MenuItemContainer>
  );
};

export default MenuItem;
