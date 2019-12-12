import PropTypes from 'prop-types';
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

function Header({
  title,
  preview,
  isUserMenu,
  history,
  withLogo,
  onBackClick,
  leftRenderer,
  rightRenderer,
  centerRenderer,
  subHeaderRenderer,
  disableLogoClick,
  logoAssetPath,
}) {
  return (
    <HeaderContainer>
      <PrimaryHeader isBackClick={onBackClick}>
        {withLogo && (
          <Logo
            disableLogoClick={disableLogoClick}
            src={logoAssetPath || '/logo_bubble_Small.png'}
            alt="logo"
            draggable="false"
            onClick={() => (disableLogoClick ? null : history.push('/'))}
          />
        )}
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
            {!preview && rightRenderer && <TitleGroup>{rightRenderer()}</TitleGroup>}
            {!isUserMenu && <UserMenu history={history} preview={preview} />}
          </JustifiedHeaderActions>
        </HeaderActions>
      </PrimaryHeader>
      {subHeaderRenderer && <SecondaryNavWrapper>{subHeaderRenderer()}</SecondaryNavWrapper>}
    </HeaderContainer>
  );
}

Header.propTypes = {
  title: PropTypes.node,
  className: PropTypes.string,
  leftRenderer: PropTypes.func,
  rightRenderer: PropTypes.func,
  leftClassName: PropTypes.string,
  gridClassName: PropTypes.string,
  rightClassName: PropTypes.string,
  centerRenderer: PropTypes.func,
  subHeaderRenderer: PropTypes.func,
  logoAssetPath: PropTypes.string,
};

export default Header;
