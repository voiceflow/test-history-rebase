import PropTypes from 'prop-types';
import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
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
  withUserMenu = true,
  history,
  withLogo,
  onBackClick,
  leftRenderer,
  rightRenderer,
  centerRenderer,
  subHeaderRenderer,
  disableLogoClick,
}) {
  const { open: openWorkspaceSettings } = useModals(ModalType.BOARD_SETTINGS);
  return (
    <HeaderContainer>
      <PrimaryHeader isBackClick={onBackClick}>
        {withLogo && <Logo icon="logo" size={36} onClick={() => (disableLogoClick ? null : openWorkspaceSettings())} />}
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
            {withUserMenu && <UserMenu history={history} preview={preview} />}
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
};

export default Header;
