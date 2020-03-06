import React from 'react';

import SvgIcon, { Icon } from '@/components/SvgIcon';
import OverflowText from '@/components/Text/OverflowText';
import { BlockState, BlockVariant } from '@/constants/canvas';

import Content from '../NewBlockContent';
import Header from '../NewBlockHeader';
import { IconContainer, SectionContainer } from './components';

export type NewBlockSectionProps = {
  icon?: Icon;
  name: string;
  state: BlockState;
  variant: BlockVariant;
};

const NewBlockSection: React.FC<NewBlockSectionProps> = ({ state, variant, name, children, icon }) => (
  <SectionContainer>
    <Header hasIcon={!!icon} variant={variant} state={state}>
      {icon && (
        <IconContainer>
          <SvgIcon icon={icon} color="#6e849a" />
        </IconContainer>
      )}
      <OverflowText>{name}</OverflowText>
    </Header>
    <Content>{children}</Content>
  </SectionContainer>
);

export default NewBlockSection;
