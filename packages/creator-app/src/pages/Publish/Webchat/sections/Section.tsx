import { Box, Collapse, SvgIcon, ThemeColor, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import { SectionArrow, SectionBody, SectionContainer, SectionHeader, SectionIcon } from './styled';

interface SectionProps {
  icon: keyof typeof SvgIcon.ICONS;
  title: string;
  description: string;
}

const SECTION_PREFIX = 'webchat-section_';

const Section: React.FC<SectionProps> = ({ title, description, icon, children }) => {
  const [isOpen, setIsOpen] = useLocalStorageState(SECTION_PREFIX + title, false);

  return (
    <SectionContainer isOpen={isOpen}>
      <SectionHeader onClick={() => setIsOpen(!isOpen)}>
        <SectionIcon mr={20}>
          <SvgIcon icon={icon} />
        </SectionIcon>
        <Box flexGrow={1}>
          <Box color={ThemeColor.PRIMARY} fontWeight={600}>
            {title}
          </Box>
          <Box color={ThemeColor.SECONDARY} fontSize={13} mt={3}>
            {description}
          </Box>
        </Box>
        <SectionArrow>
          <SvgIcon icon="arrowRight" color="rgba(110, 132, 154, 0.65)" size={12} />
        </SectionArrow>
      </SectionHeader>
      <Collapse isOpen={isOpen}>
        <SectionBody>{children}</SectionBody>
      </Collapse>
    </SectionContainer>
  );
};

export default Section;
