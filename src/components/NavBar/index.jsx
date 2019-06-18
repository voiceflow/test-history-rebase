import './NavBar.css';

// Components
import { User } from 'components/User/User';
// Actions
import { logout } from 'ducks/account';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Navbar, NavbarToggler, UncontrolledDropdown } from 'reactstrap';

const NUM_TO_PLAN = (plan) => {
  switch (plan) {
    case 0:
      return 'COMMUNITY';
    case 1:
      return 'BASIC';
    case 10:
      return 'ADMIN';
    default:
      return 'UNKNOWN';
  }
};

const getPage = (path) => {
  const base = path.split('/');
  return base[1].toLowerCase();
};

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.intercom_user = {};

    const tabs = [];
    const user = props.user;
    if (user.id !== null) {
      this.intercom_user = {
        user_id: user.id,
        name: user.name,
        email: user.email,
        plan: NUM_TO_PLAN(user.admin),
      };
    } else {
      this.intercom_user = {};
    }

    this.state = {
      accountOpen: false,
      isOpen: false,
      tabs,
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  logout(e) {
    e.preventDefault();
    this.props.logout().then(() => {
      this.props.history.push('/login');
    });
    return false;
  }

  render() {
    const page_name = `/${getPage(this.props.history.location.pathname)}`;
    let image = '/logo.png';
    if (this.props.team && this.props.team.status > 0 && this.props.team.image) {
      image = this.props.team.image;
    }

    return (
      <div className="header">
        <Navbar dark expand="md" className={`fixed-top ${page_name}`} id="navbar">
          <Link to="/dashboard" className="mx-2">
            <div className="mt-1 voiceflow-logo" style={{ backgroundImage: `url('${image}')` }} />
          </Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              {this.state.tabs.map(function(tab, i) {
                if (page_name === tab.link) {
                  return (
                    <NavItem key={i}>
                      <NavLink active>{tab.text}</NavLink>
                    </NavItem>
                  );
                }
                if (tab.link.startsWith('/')) {
                  return (
                    <NavItem key={i}>
                      <Link to={tab.link} className="nav-link">
                        {tab.text}
                      </Link>
                    </NavItem>
                  );
                }
                return (
                  <NavItem key={i}>
                    <a href={tab.link} className="nav-link" target="_blank" rel="noopener noreferrer">
                      {tab.text}
                    </a>
                  </NavItem>
                );
              })}
            </Nav>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav inNavbar className="account-dropdown mt-1">
                <DropdownToggle className="account hover" nav tag="div">
                  <User user={this.props.user} className="pointer" />
                </DropdownToggle>
                <DropdownMenu right className="arrow arrow-right no-select">
                  <DropdownItem header>{this.props.user.email}</DropdownItem>
                  <DropdownItem divider />
                  <Link className="dropdown-item" to="/account">
                    Account
                  </Link>
                  {this.props.user.admin >= 100 && (
                    <Link className="dropdown-item" to="/admin">
                      Admin
                    </Link>
                  )}
                  <DropdownItem onClick={this.logout} tag="a" href="#">
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
        {!!this.props.padding && <div className="padding" />}
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <Intercom appID="vw911b0m" {...this.intercom_user} />
        {!this.props.preview && getPage(this.props.location.pathname) !== 'dashboard' && (
          // eslint-disable-next-line react/jsx-no-undef
          <SecondaryNavBar page={this.props.page} history={this.props.history} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
  team: state.team.byId[state.team.team_id],
});

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);
