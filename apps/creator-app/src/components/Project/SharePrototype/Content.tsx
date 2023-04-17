import { Box } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant, UncontrolledSection } from '@/components/Section';
import Upgrade from '@/components/Upgrade';
import { Permission } from '@/constants/permissions';
import { ScrollContextProvider } from '@/contexts/ScrollContext';
import * as VariableState from '@/ducks/variableState';
import { usePermission, useSelector } from '@/hooks';
import { useScrollHelpers, useScrollStickySides } from '@/hooks/scroll';
import { Identifier } from '@/styles/constants';

import { AppearanceAndBranding, Container, Header, LayoutSelect, PasswordInput, Title, VariableStateSelect } from './components';

enum ActiveModal {
  NONE = 'none',
  PASSWORD = 'password',
  APPEARANCE = 'appearance',
  VARIABLE_STATE = 'variableState',
}

export const Content: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState(ActiveModal.NONE);

  const variableStates = useSelector(VariableState.allVariableStatesSelector);

  const [canCustomize] = usePermission(Permission.CUSTOMIZE_PROTOTYPE);

  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers<HTMLDivElement, HTMLDivElement>();
  const [isHeaderSticky] = useScrollStickySides(bodyRef);

  const onToggleSection = (section: ActiveModal) => () => setActiveSection((prev) => (section !== prev ? section : ActiveModal.NONE));

  return (
    <ScrollContextProvider value={scrollHelpers}>
      <Container>
        <Header isScrolling={!!isHeaderSticky}>
          <Title>Share prototype with testers</Title>
        </Header>

        <div ref={bodyRef} style={{ overflowX: 'hidden', overflowY: 'auto', paddingBottom: '50px' }}>
          <Box ref={innerRef} pl={32}>
            <Box>
              <LayoutSelect />
            </Box>

            <UncontrolledSection
              id={Identifier.APPEARANCE_AND_BRANDING_DD}
              toggle={onToggleSection(ActiveModal.APPEARANCE)}
              header="Appearance and Branding"
              isCollapsed={activeSection !== ActiveModal.APPEARANCE}
              headerToggle
              nestedIntend
              collapseVariant={SectionToggleVariant.ARROW}
              customContentStyling={{ paddingLeft: 0 }}
            >
              <AppearanceAndBranding isAllowed={canCustomize} />
            </UncontrolledSection>

            {!!variableStates?.length && (
              <UncontrolledSection
                toggle={onToggleSection(ActiveModal.VARIABLE_STATE)}
                header="Variable State"
                dividers={activeSection !== ActiveModal.APPEARANCE}
                isCollapsed={activeSection !== ActiveModal.VARIABLE_STATE}
                headerToggle
                nestedIntend
                collapseVariant={SectionToggleVariant.ARROW}
                customContentStyling={{ paddingLeft: 0 }}
              >
                <Box mb={16}>
                  <VariableStateSelect />
                </Box>
              </UncontrolledSection>
            )}
          </Box>

          <PasswordInput
            dividers={!!variableStates?.length || activeSection !== ActiveModal.APPEARANCE}
            isCollapsed={activeSection !== ActiveModal.PASSWORD}
            onToggleCollapse={onToggleSection(ActiveModal.PASSWORD)}
          />
        </div>

        {!canCustomize && (
          <Box position="absolute" left={0} right={0} bottom={0}>
            <Upgrade>Customize prototype style and branding.</Upgrade>
          </Box>
        )}
      </Container>
    </ScrollContextProvider>
  );
};
