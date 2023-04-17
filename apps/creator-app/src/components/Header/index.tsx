import { SVG, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { logoDark } from '@/assets';
import { ClassName } from '@/styles/constants';

import {
  BackButton,
  CenterGroup,
  HeaderActions,
  HeaderContainer,
  HeaderNavigation,
  JustifiedHeaderActions,
  Logo,
  PrimaryHeader,
  SecondaryNavWrapper,
  TitleGroup,
  UserMenu,
} from './components';

interface HeaderProps {
  title?: React.ReactNode;
  withUserMenu?: boolean;
  withLogo?: boolean;
  disableLogoClick?: boolean;
  logoAssetPath?: string;
  onBackClick?: () => void;
  onLogoClick?: () => void;
  leftRenderer?: () => React.ReactNode;
  rightRenderer?: () => React.ReactNode;
  centerRenderer?: () => React.ReactNode;
  subHeaderRenderer?: () => React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  withUserMenu = true,
  withLogo,
  onBackClick,
  onLogoClick,
  leftRenderer,
  rightRenderer,
  centerRenderer,
  subHeaderRenderer,
  logoAssetPath,
}) => {
  const centerContent = centerRenderer?.();
  return (
    <HeaderContainer>
      <PrimaryHeader className={ClassName.PRIMARY_NAV}>
        {withLogo && <Logo src={logoAssetPath || logoDark} alt="logo" draggable="false" onClick={onLogoClick} />}
        {onBackClick && (
          <BackButton>
            <SvgIcon icon={SVG.arrowLeft} size={3} className="icon-back" onClick={onBackClick} />
          </BackButton>
        )}
        <HeaderNavigation>
          {leftRenderer && leftRenderer()}
          {title}
        </HeaderNavigation>
        {centerContent && <CenterGroup className={ClassName.HEADER_ACTIONS_CENTER}>{centerContent}</CenterGroup>}
        <HeaderActions>
          <JustifiedHeaderActions>
            {rightRenderer && <TitleGroup className={ClassName.HEADER_ACTIONS_RIGHT}>{rightRenderer()}</TitleGroup>}
            {withUserMenu && <UserMenu />}
          </JustifiedHeaderActions>
        </HeaderActions>
      </PrimaryHeader>
      {subHeaderRenderer && <SecondaryNavWrapper className={ClassName.SECONDARY_NAV}>{subHeaderRenderer()}</SecondaryNavWrapper>}
    </HeaderContainer>
  );
};

export default Header;
