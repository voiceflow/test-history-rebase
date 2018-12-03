import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import {Link} from 'react-router-dom';

import './NavBar.css';
import AuthenticationService from './../../../services/Authentication';
import Intercom from 'react-intercom';

const getPage = (path) => {
  let base = path.split('/');
  return base[1].toLowerCase();
}

class NavBar extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      accountOpen: false,
      isOpen: false,
      tabs: [
        {link: '/dashboard', 'text': <React.Fragment>Dashboard</React.Fragment>},
        {link: '/canvas', 'text': <React.Fragment>Canvas</React.Fragment>},
        //{link: '/business', 'text': <React.Fragment>Business</React.Fragment>},
        // {link: '/market', 'text': <React.Fragment>Marketplace</React.Fragment>},
      ],
      user: AuthenticationService.getUser()
    };
  }

  componentDidMount() {
    if(this.state.user.admin === 10){
      let tabs = this.state.tabs;
      tabs.push({link: '/business', 'text': <React.Fragment>Business</React.Fragment>});
      // tabs.push({link: 'admin', text: <span>Admin <i className="fas fa-columns"></i></span>});
      // tabs.push({link: 'analytics', text: <span>Analytics <i className="fas fa-chart-line"></i></span>});
      this.setState({tabs: tabs});
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logout(e) {
    e.preventDefault();
    AuthenticationService.logout(() => {
      console.log("logout");
      this.props.history.push('/login');
    });
    return false;
  }

  preventDefault(e){
    e.preventDefault();
    return false;
  }

  render() {

    let intercom_user = this.state.user ? {
      user_id: this.state.user.id,
      name: this.state.user.name,
      email: this.state.user.email
    } : null;
    let page_name = '/' + getPage(this.props.location.pathname);

    return (
        <div>
          <Navbar dark expand="md" className={"fixed-top " + page_name} id="navbar">
            <NavbarBrand href="https://www.getvoiceflow.com" target="_blank">
              <img className='voiceflow-logo' src={process.env.PUBLIC_URL+'/logo.svg'} alt='logo' 
                height="33"
              />
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="mr-auto" navbar>
                {this.state.tabs.map(function(tab, i){
                    if(page_name === tab.link){
                      return (
                        <NavItem key={i}>
                          <NavLink active>{tab.text}</NavLink>
                        </NavItem>)
                    }else if(tab.link.startsWith('/')){
                      return (
                        <NavItem key={i}>
                          <Link to={tab.link} className="nav-link">{tab.text}</Link>
                        </NavItem>)
                    }else{
                      return (
                        <NavItem key={i}>
                          <a href={tab.link} className="nav-link" target='_blank' rel="noopener noreferrer">{tab.text}</a>
                        </NavItem>)
                    }
                })}
              </Nav>
              <Nav className="ml-auto" navbar>
                <UncontrolledDropdown nav inNavbar className="account-dropdown">
                  <DropdownToggle className="account" nav tag="div">
                    <i className="fas fa-user-circle"/>
                  </DropdownToggle>
                  <DropdownMenu right className="arrow no-select">
                    <DropdownItem header>
                      {this.state.user.email}
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={this.logout} tag="a" href="#">
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Navbar>
          {this.props.padding ? (<div className="padding"></div>) : null}
          <Intercom appID="vw911b0m" {...intercom_user}/>
        </div>
    );
  }
}

export default NavBar;
