import { Box, Collapse } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/legacy/Checkbox';

import { ContentContainer, HeaderContainer } from './components';

interface MenuSectionProps {
  title: string;
  children: React.ReactElement;
  toggleSection: () => void;
  enabled: boolean;
  className?: string;
}

const MenuSection: React.FC<MenuSectionProps> = ({ title, enabled, toggleSection, className, children }) => (
  <>
    <HeaderContainer>
      <Checkbox checked={enabled} onChange={toggleSection} className={className}>
        <Box color="primary" fontWeight="normal">
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
