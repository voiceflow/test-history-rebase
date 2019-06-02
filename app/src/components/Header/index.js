import React from 'react';
import { connect } from 'react-redux'
import cn from 'classnames';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Intercom from 'react-intercom';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

// Actions
import { logout } from 'ducks/account'

// Components
import { User } from 'components/User/User'

import './Header.css'

const NUM_TO_PLAN = (plan) => {
  switch (plan) {
    case 0:
      return 'COMMUNITY'
    case 1:
      return 'BASIC'
    case 10:
      return 'ADMIN'
    default:
      return 'UNKNOWN'
  }
}

const Header = (props) => {
  const {
    user,
    title,
    logout,
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

  const intercom_user = (user.id !== null) ? {
    user_id: user.id,
    name: user.name,
    email: user.email,
    plan: NUM_TO_PLAN(user.admin)
  } : {}
  const userLogout = e => {
    e.preventDefault()
    logout().then(() => {
      history.push('/login')
    })
    return false;
  }

  const renderRight = () => {
    if(!preview) {
      return <>
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
      </>
    } else {
      return (<div className="title-group no-select">
          <span className="text-blue" id="preview-title">
            <span className="dot"/> PREVIEW MODE
          </span>
      </div>)
    }
  }

  return (
    <div className={cn('header', className)}>
      <div className="header-inner">
        <div className={cn('header-grid __with-center', gridClassName)}>
            {(leftRenderer || withLogo) && <div className={cn('header-grid__left', leftClassName)}>
              {withLogo &&
              <Link to="/dashboard" className="mx-2">
                  <img className='voiceflow-logo mt-1' src={'/favicon.png'} alt='logo'
                      height="30" width="40"
                  />
              </Link>}
              {leftRenderer && leftRenderer()}
              {!!title && <div className="header__title">{title}</div>}
            </div>
            }

          {centerRenderer && <div className="header-grid__center">{centerRenderer()}</div>}

          <div className={cn('header-grid__right', rightClassName)}>
            {renderRight()}
          </div>
        </div>
      </div>

      {subHeaderRenderer && subHeaderRenderer()}
      <Intercom appID = "vw911b0m" {
        ...intercom_user
      }
      />
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
