import { Box, SectionV2, SvgIcon, SvgIconTypes, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';

import * as S from './styles';

interface SectionProps extends React.PropsWithChildren {
  icon: SvgIconTypes.Icon;
  title: React.ReactNode;
  description: React.ReactNode;
  defaultOpen?: boolean;
}

const SECTION_PREFIX = 'webchat-section_';

const Section: React.FC<SectionProps> = ({ title, description, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useLocalStorageState(SECTION_PREFIX + title, defaultOpen);

  return (
    <Settings.Section mb={16}>
      <Settings.Card>
        <SectionV2.CollapseSection
          onToggle={(collapsed) => setIsOpen(!collapsed)}
          collapsed={!isOpen}
          header={({ collapsed, onToggle }) => (
            <S.Header>
              <SectionV2.Header topUnit={3} bottomUnit={3} onClick={onToggle}>
                <S.IconContainer mr={20}>
                  <SvgIcon icon={icon} />
                </S.IconContainer>

                <Box width="100%">
                  <Settings.SubSection.Title>{title}</Settings.SubSection.Title>

                  <Settings.SubSection.Description>{description}</Settings.SubSection.Description>
                </Box>

                <S.ArrowContainer isOpen={!collapsed}>
                  <SvgIcon icon="arrowToggle" size={12} />
                </S.ArrowContainer>
              </SectionV2.Header>
            </S.Header>
          )}
        >
          <S.Body>{children}</S.Body>
        </SectionV2.CollapseSection>
      </Settings.Card>
    </Settings.Section>
  );
};

export default Section;
