import { Box, Link } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant, UncontrolledSection } from '@/components/Section';
import Upgrade from '@/components/Upgrade';
import * as Documentation from '@/config/documentation';
import { Permission } from '@/config/permissions';
import { ScrollContextProvider } from '@/contexts';
import { usePermission } from '@/hooks';
import { useScrollHelpers, useScrollStickySides } from '@/hooks/scroll';
import { FadeLeftContainer } from '@/styles/animations';
import { Identifier } from '@/styles/constants';

import { AppearanceAndBranding } from './AppearanceAndBranding';
import Description from './Description';
import Header from './Header';
import MenuContentHeader from './MenuContentHeader';
import PrototypeLayoutSelect from './PrototypeLayoutSelect';
import PrototypePasswordInput from './PrototypePasswordInput';

enum ActiveModal {
  NONE = 'none',
  APPEARANCE = 'appearance',
  PASSWORD = 'password',
}

const MenuContent: React.FC<{ inline?: boolean }> = ({ inline }) => {
  const [canCustomize] = usePermission(Permission.CUSTOMIZE_PROTOTYPE);

  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers<HTMLDivElement, HTMLDivElement>();
  const [isHeaderSticky] = useScrollStickySides(bodyRef);

  const [activeModal, setActiveModal] = React.useState(ActiveModal.NONE);

  const onTogglePassword = React.useCallback(() => {
    setActiveModal((prev) => (prev === ActiveModal.PASSWORD ? ActiveModal.NONE : ActiveModal.PASSWORD));
  }, [setActiveModal]);

  const onToggleAppearance = React.useCallback(() => {
    setActiveModal((prev) => (prev === ActiveModal.APPEARANCE ? ActiveModal.NONE : ActiveModal.APPEARANCE));
  }, [setActiveModal]);

  const Container = inline ? FadeLeftContainer : 'div';

  return (
    <ScrollContextProvider value={scrollHelpers}>
      <Container style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <MenuContentHeader isScrolling={!!isHeaderSticky}>
          <Header marginBottom={8}>Share Assistant with Testers</Header>

          <Description fontSize={inline ? 13 : 15} lineHeight="normal">
            <span>Share a testable version of your project in the browser on web or mobile. </span>
            <Link href={Documentation.PROTOTYPE_SHARE}>Learn More</Link>
          </Description>
        </MenuContentHeader>

        <div ref={bodyRef} style={{ overflowX: 'hidden', overflowY: 'auto', paddingBottom: '50px' }}>
          <Box ref={innerRef} pl={32}>
            <Box>
              <Header secondary marginBottom={12}>
                Test Type
              </Header>

              <PrototypeLayoutSelect />
            </Box>

            <UncontrolledSection
              id={Identifier.APPEARANCE_AND_BRANDING_DD}
              nestedIntend
              header="Appearance and Branding"
              headerToggle
              collapseVariant={SectionToggleVariant.ARROW}
              isCollapsed={activeModal !== ActiveModal.APPEARANCE}
              toggle={onToggleAppearance}
              customContentStyling={{ paddingLeft: 0 }}
            >
              <AppearanceAndBranding isAllowed={canCustomize} />
            </UncontrolledSection>
          </Box>
          <PrototypePasswordInput isCollapsed={activeModal !== ActiveModal.PASSWORD} onToggleCollapse={onTogglePassword} />
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

export default MenuContent;
