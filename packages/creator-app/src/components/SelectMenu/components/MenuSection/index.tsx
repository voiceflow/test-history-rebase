import { Box, Collapse } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';

import { ContentContainer, HeaderContainer } from './components';

interface MenuSectionProps {
  title: string;
  children: React.ReactElement;
  toggleSection: () => void;
  enabled: boolean;
}

const MenuSection: React.FC<MenuSectionProps> = ({ title, enabled, toggleSection, children }) => (
  <>
    <HeaderContainer>
      <Checkbox checked={enabled} onChange={toggleSection}>
        <Box color="black" fontWeight={500}>
          {title}
        </Box>
      </Checkbox>
    </HeaderContainer>
    <Collapse isOpen={enabled}>
      <ContentContainer>{children}</ContentContainer>
    </Collapse>
  </>
);

export default MenuSection;
