import './Header.css';

// import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import LeftIcon from '@/svgs/arrow-left.svg';

import UserMenu from './components/UserMenu';
import { BackButton, CenterGroup, HeaderActions, HeaderContainer, HeaderNavigation, JustifiedHeaderActions, Logo, PrimaryHeader } from './styled';

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
}) {
  return (
    <HeaderContainer>
      <PrimaryHeader isBackClick={onBackClick}>
        {withLogo && (
          <Logo
            disableLogoClick={disableLogoClick}
            src="/logo_bubble_Small.png"
            alt="logo"
            draggable="false"
            onClick={() => (disableLogoClick ? null : history.push('/'))}
          />
        )}
        {onBackClick && (
          <BackButton>
            <SvgIcon icon={LeftIcon} className="icon-back" onClick={onBackClick} />
          </BackButton>
        )}
        <HeaderNavigation>
          {leftRenderer && leftRenderer()}
          {title}
        </HeaderNavigation>
        <HeaderActions>
          <CenterGroup>{centerRenderer && centerRenderer()}</CenterGroup>
          <JustifiedHeaderActions>
            {!preview && rightRenderer && <div className="title-group no-select">{rightRenderer()}</div>}
            {!isUserMenu && <UserMenu history={history} preview={preview} />}
          </JustifiedHeaderActions>
        </HeaderActions>
      </PrimaryHeader>
      {subHeaderRenderer && subHeaderRenderer()}
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
};

export default Header;
