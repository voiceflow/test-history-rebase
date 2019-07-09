import './Header.css';

import cn from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import IntercomChat from './components/IntercomChat';
import UserMenu from './components/UserMenu';

const Header = (props) => {
  const {
    title,
    preview,
    history,
    withLogo,
    className,
    leftRenderer,
    rightRenderer,
    leftClassName,
    gridClassName,
    rightClassName,
    centerRenderer,
    subHeaderRenderer,
  } = props;

  return (
    <div className={cn('header', className)}>
      <div className="header-inner">
        <div className={cn('header-grid __with-center', gridClassName)}>
          {(leftRenderer || withLogo) && (
            <div className={cn('header-grid__left', leftClassName)}>
              {withLogo && (
                <Link to="/dashboard" className="mx-2">
                  <img className="voiceflow-logo" src="/logo.png" alt="logo" />
                </Link>
              )}
              {leftRenderer && leftRenderer()}
              {!!title && <div className="header__title">{title}</div>}
            </div>
          )}

          {centerRenderer && <div className="header-grid__center">{centerRenderer()}</div>}

          <div className={cn('header-grid__right', rightClassName)}>
            {!preview && rightRenderer && rightRenderer()}
            <UserMenu history={history} preview={preview} />
          </div>
        </div>
      </div>

      {subHeaderRenderer && subHeaderRenderer()}
      <IntercomChat />
    </div>
  );
};

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
