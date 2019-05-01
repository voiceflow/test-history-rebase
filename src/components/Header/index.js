import React from 'react';
import { connect } from 'react-redux'
import cn from 'classnames';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import './Header.css'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import { logout } from 'ducks/account'
import { User } from 'views/components/User'

const Header = (props) => {
  const {
    user,
    title,
    logout,
    history,
    className,
    leftRenderer,
    rightRenderer,
    leftClassName,
    gridClassName,
    rightClassName,
    centerRenderer,
    subHeaderRenderer,
  } = props;

  const userLogout = e => {
    e.preventDefault()
    logout().then(() => {
      history.push('/login')
    })
    return false;
  }
  return (
    <div className={cn('header', className)}>
      <div className="header-inner">
        <div className={cn('header-grid __with-center', gridClassName)}>
            {leftRenderer && <div className={cn('header-grid__left', leftClassName)}>
              {leftRenderer()}
              {!!title && <div className="header__title">{title}</div>}
            </div>
            }

          {centerRenderer && <div className="header-grid__center">{centerRenderer()}</div>}

          <div className={cn('header-grid__right', rightClassName)}>
            {rightRenderer && rightRenderer()}
            <UncontrolledDropdown className="account-dropdown">
                  <DropdownToggle className="account hover" nav tag="div">
                    <User user={user} className="pointer"/>
                  </DropdownToggle>
                  <DropdownMenu right className="arrow arrow-right no-select">
                    <DropdownItem header>
                      {user.email}
                    </DropdownItem>
                    <DropdownItem divider />
                    <Link className="dropdown-item" to="/account">
                      Account
                    </Link>
                    { user.admin >= 100 &&
                        <Link className="dropdown-item" to="/admin">
                          Admin
                        </Link>
                    }
                    <DropdownItem onClick={userLogout} tag="a" href="#">
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
          </div>
        </div>
      </div>

      {subHeaderRenderer && subHeaderRenderer()}
    </div>
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

const mapStateToProps = state => ({
  user: state.account,
})

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  }
}

export default connect (mapStateToProps, mapDispatchToProps)(Header)