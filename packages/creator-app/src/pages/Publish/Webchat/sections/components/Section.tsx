import { Box, Collapse, SvgIcon, ThemeColor, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import { SectionArrow, SectionBody, SectionContainer, SectionGroup, SectionHeader, SectionIcon } from './styled';

interface SectionProps {
  icon: keyof typeof SvgIcon.ICONS;
  title: string;
  description: string;
  defaultOpen?: boolean;
}

const SECTION_PREFIX = 'webchat-section_';

const Section: React.OldFC<SectionProps> = ({ title, description, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useLocalStorageState(SECTION_PREFIX + title, defaultOpen);

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
          <Box color={ThemeColor.SECONDARY} mt={2}>
            {description}
          </Box>
        </Box>
        <SectionArrow>
          <SvgIcon icon="arrowToggle" size={12} />
        </SectionArrow>
      </SectionHeader>
      <Collapse isOpen={isOpen}>
        <SectionBody>{children}</SectionBody>
      </Collapse>
    </SectionContainer>
  );
};

export default Object.assign(Section, { Group: SectionGroup, Container: SectionContainer });
