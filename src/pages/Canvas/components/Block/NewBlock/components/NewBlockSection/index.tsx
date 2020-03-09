import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import OverflowText from '@/components/Text/OverflowText';

import { SectionProps } from '../../types';
import Content from '../NewBlockContent';
import Header from '../NewBlockHeader';
import { IconContainer, SectionContainer } from './components';

const NewBlockSection: React.FC<SectionProps> = ({ state, variant, name, children, icon }) => (
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
