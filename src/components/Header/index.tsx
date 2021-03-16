import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import LeftIcon from '@/svgs/arrow-left.svg';

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

type HeaderProps = {
  title?: React.ReactNode;
  withUserMenu?: boolean;
  withLogo?: boolean;
  disableLogoClick?: boolean;
  logoAssetPath?: string;
  onBackClick?: () => void;
  leftRenderer?: () => React.ReactNode;
  rightRenderer?: () => React.ReactNode;
  centerRenderer?: () => React.ReactNode;
  subHeaderRenderer?: () => React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({
  title,
  withUserMenu = true,
  withLogo,
  onBackClick,
  leftRenderer,
  rightRenderer,
  centerRenderer,
  subHeaderRenderer,
  logoAssetPath,
}) => (
  <HeaderContainer>
    <PrimaryHeader>
      {withLogo && <Logo src={logoAssetPath || '/vf-logo-dashboard.svg'} alt="logo" draggable="false" />}
      {onBackClick && (
        <BackButton>
          <SvgIcon icon={LeftIcon} size={3} className="icon-back" onClick={onBackClick} />
        </BackButton>
      )}
      <HeaderNavigation>
        {leftRenderer && leftRenderer()}
        {title}
      </HeaderNavigation>
      <HeaderActions>
        <CenterGroup>{centerRenderer && centerRenderer()}</CenterGroup>
        <JustifiedHeaderActions>
          {rightRenderer && <TitleGroup>{rightRenderer()}</TitleGroup>}
          {withUserMenu && <UserMenu />}
        </JustifiedHeaderActions>
      </HeaderActions>
    </PrimaryHeader>
    {subHeaderRenderer && <SecondaryNavWrapper>{subHeaderRenderer()}</SecondaryNavWrapper>}
  </HeaderContainer>
);

export default Header;
