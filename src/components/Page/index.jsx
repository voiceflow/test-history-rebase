import React from 'react';
import ReactDom from 'react-dom';

import UserMenu from '@/components/Header/components/UserMenu';
import { BackButton } from '@/components/Header/styled';
import SvgIcon from '@/components/SvgIcon';
import ArrowLeftIcon from '@/svgs/arrow-left.svg';

import { Container, Content, Header, HeaderContainer, HeaderPortalContainer, SubHeader } from './components';

export { Container };

export const HeaderContext = React.createContext(null);

const Page = ({ header, subHeader, scrollHorizontal, canScroll = true, userMenu = true, onNavigateBack, children }) => {
  const headerRef = React.useRef(null);

  return (
    <HeaderContext.Provider value={headerRef}>
      <Container>
        <HeaderContainer>
          <Header>
            {onNavigateBack && (
              <BackButton onClick={onNavigateBack}>
                <SvgIcon icon={ArrowLeftIcon} size={14} className="icon-back" />
              </BackButton>
            )}
            <HeaderPortalContainer ref={headerRef}>{header}</HeaderPortalContainer>
            {userMenu && <UserMenu />}
          </Header>
          {subHeader && <SubHeader>{subHeader}</SubHeader>}
        </HeaderContainer>
        <Content scrollHorizontal={scrollHorizontal} canScroll={canScroll}>
          {children}
        </Content>
      </Container>
    </HeaderContext.Provider>
  );
};

export const HeaderPortal = ({ children }) => {
  // skip mounting cycle since parent needs to mount for headerRef to be declared
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return mounted ? (
    <HeaderContext.Consumer>{(headerRef) => headerRef && ReactDom.createPortal(children, headerRef.current)}</HeaderContext.Consumer>
  ) : null;
};

export default Page;
