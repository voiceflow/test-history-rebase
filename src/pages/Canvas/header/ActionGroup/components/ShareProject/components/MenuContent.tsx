import React from 'react';
import { withTheme } from 'styled-components';

import Box from '@/components/Box';
// import Divider from '@/components/Divider';
// import { SectionToggleVariant, UncontrolledSection } from '@/components/Section';
// import SvgIcon from '@/components/SvgIcon';
import { Link } from '@/components/Text';
// import { ModalType } from '@/constants';
import { ScrollContextProvider } from '@/contexts';
// import { useModals } from '@/hooks';
import { useScrollHelpers, useScrollShadows } from '@/hooks/scroll';
import { useToggle } from '@/hooks/toggle';
import { Theme } from '@/styles/theme';

import Description from './Description';
import Header from './Header';
import MenuContentHeader from './MenuContentHeader';
import PrototypeLayoutSelect from './PrototypeLayoutSelect';

export type MenuContentProps = {
  theme: Theme;
};

const MenuContent: React.FC<MenuContentProps> = () => {
  const [isExpanded] = useToggle(false);
  // const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers();

  const [onScroll, isHeaderShadowShown]: any = useScrollShadows(bodyRef, [isExpanded]);

  //  TODO: enable commented code after initial release

  return (
    <ScrollContextProvider value={scrollHelpers}>
      <MenuContentHeader scrolling={!!isHeaderShadowShown}>
        <Header marginBottom={12}>Share your Assistant with Testers</Header>
        <Description fontSize={15} lineHeight="normal">
          <span>Share a testable version of your project in the browser on web or mobile. </span>
          <Link href="https://docs.voiceflow.com/#/quickstart/testable-links">Learn More</Link>
        </Description>
      </MenuContentHeader>
      {/* TODO: change height back to 215px */}
      <div ref={bodyRef} onScroll={onScroll} style={{ overflowX: 'hidden', overflowY: 'auto', height: '122px' }}>
        <Box ref={innerRef} pl={32}>
          <Box>
            <Header secondary marginBottom={12}>
              Test Type
            </Header>
            <PrototypeLayoutSelect />
          </Box>
          {/* <UncontrolledSection
            nestedIntend
            header="Appearance and Branding"
            collapseVariant={SectionToggleVariant.ARROW}
            isCollapsed={!isExpanded}
            toggle={toggle}
          >
            <Box pt={42} pb={42}>
              Image and Color selection goes here
            </Box>
          </UncontrolledSection>
          <Divider style={{ marginTop: 0, marginBottom: '32px' }} /> */}
        </Box>
      </div>
      {/* <Box>
        <Flex pt={15} pr={32} pb={15} pl={32} borderTop="1px solid #efefef">
          <SvgIcon icon="upgrade" color={theme.colors.green} />
          <Text fontSize={13} ml={16} color={theme.colors.secondary} mr={5}>
            Customize prototype style and branding.
          </Text>
          <ClickableText fontSize={13} onClick={openPaymentsModal}>
            Upgrade.
          </ClickableText>
        </Flex>
      </Box> */}
    </ScrollContextProvider>
  );
};

export default withTheme(MenuContent);
