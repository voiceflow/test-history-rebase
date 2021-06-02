import React from 'react';

import PlanBubble from '@/components/PlanBubble';
import { PlanType } from '@/constants';
import { stopImmediatePropagation } from '@/utils/dom';

import Description from './Description';
import Header from './Header';
import MenuItemContainer from './MenuItemContainer';

type MenuItemProps = {
  title: string;
  description: string;
  isAllowed: boolean;
};

const MenuItem: React.FC<MenuItemProps> = ({ title, description, isAllowed }) => (
  <MenuItemContainer onClick={stopImmediatePropagation()}>
    <div>
      <Header marginBottom={12}>
        <span>{title}</span>
        {!isAllowed && <PlanBubble plan={PlanType.PRO} />}
      </Header>
      <Description fontSize={15} lineHeight="normal">
        <span>{description}</span>
      </Description>
    </div>
  </MenuItemContainer>
);

export default MenuItem;
