import React from 'react';

import Box from '@/components/Box';
import Divider from '@/components/Divider';
import { SectionToggleVariant, UncontrolledSection } from '@/components/Section';
import { Link } from '@/components/Text';
import Upgrade from '@/components/Upgrade';
import { Permission } from '@/config/permissions';
import { OverlayProvider, ScrollContextProvider } from '@/contexts';
import { usePermission } from '@/hooks';
import { useScrollHelpers, useScrollShadows } from '@/hooks/scroll';

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

const MenuContent: React.FC = () => {
  const [contentNode, setContentNode] = React.useState<HTMLDivElement | null>(null);
  const [canCustomize] = usePermission(Permission.CUSTOMIZE_PROTOTYPE);

  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers<HTMLDivElement, HTMLDivElement>();
  const [onScroll, isHeaderShadowShown] = useScrollShadows(bodyRef, []);

  const [activeModal, setActiveModal] = React.useState(ActiveModal.NONE);

  const onTogglePassword = React.useCallback(() => {
    setActiveModal((prev) => (prev === ActiveModal.PASSWORD ? ActiveModal.NONE : ActiveModal.PASSWORD));
  }, [setActiveModal]);

  const onToggleAppearance = React.useCallback(() => {
    setActiveModal((prev) => (prev === ActiveModal.APPEARANCE ? ActiveModal.NONE : ActiveModal.APPEARANCE));
  }, [setActiveModal]);

  return (
    <ScrollContextProvider value={scrollHelpers}>
      <div ref={setContentNode}>
        <OverlayProvider rootNode={contentNode || undefined}>
          <MenuContentHeader isScrolling={!!isHeaderShadowShown}>
            <Header marginBottom={12}>Share Assistant with Testers</Header>

            <Description fontSize={15} lineHeight="normal">
              <span>Share a testable version of your project in the browser on web or mobile. </span>
              <Link href="https://docs.voiceflow.com/#/quickstart/testable-links">Learn More</Link>
            </Description>
          </MenuContentHeader>

          <div ref={bodyRef} onScroll={onScroll} style={{ overflowX: 'hidden', overflowY: 'auto', height: '286px' }}>
            <Box ref={innerRef} pl={32}>
              <Box>
                <Header secondary marginBottom={12}>
                  Test Type
                </Header>

                <PrototypeLayoutSelect />
              </Box>
              <UncontrolledSection
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
            <Divider style={{ marginTop: 0, marginBottom: '32px', position: 'relative', top: 0, left: '32px' }} />
          </div>
          {!canCustomize && <Upgrade>Customize prototype style and branding.</Upgrade>}
        </OverlayProvider>
      </div>
    </ScrollContextProvider>
  );
};

export default MenuContent;
