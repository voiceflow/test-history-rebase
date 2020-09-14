import React from 'react';
import ReactDom from 'react-dom';

import { BackButton } from '@/components/Header/components';
import UserMenu from '@/components/Header/components/UserMenu';
import SvgIcon from '@/components/SvgIcon';
import ArrowLeftIcon from '@/svgs/arrow-left.svg';

import { Container, Content, Header, HeaderContainer, HeaderPortalContainer, NavigateBackTextContainer, SubHeader } from './components';

export { Container };

export const HeaderContext = React.createContext<React.RefObject<HTMLElement> | null>(null);

const BackButtonComp: React.FC<any> = BackButton;

export type PageProps = {
  header: React.ReactNode;
  onNavigateBack: () => void;
  subHeader?: React.ReactNode;
  canScroll?: boolean;
  scrollHorizontal?: boolean;
  userMenu?: boolean;
  navigateBackText?: string;
};

const Page: React.FC<PageProps> = ({
  header,
  navigateBackText,
  subHeader,
  scrollHorizontal,
  canScroll = true,
  userMenu = true,
  onNavigateBack,
  children,
}) => {
  const headerRef = React.useRef<HTMLDivElement>(null);

  return (
    <HeaderContext.Provider value={headerRef}>
      <Container>
        <HeaderContainer>
          <Header>
            {onNavigateBack && (
              <BackButtonComp hasBackText={!!navigateBackText} onClick={onNavigateBack}>
                <SvgIcon icon={ArrowLeftIcon} size={14} className="icon-back" />
                {navigateBackText && <NavigateBackTextContainer>{navigateBackText}</NavigateBackTextContainer>}
              </BackButtonComp>
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

export const HeaderPortal: React.FC = ({ children }) => {
  // skip mounting cycle since parent needs to mount for headerRef to be declared
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return mounted ? (
    <HeaderContext.Consumer>{(headerRef) => headerRef?.current && ReactDom.createPortal(children, headerRef.current)}</HeaderContext.Consumer>
  ) : null;
};

export default Page;
