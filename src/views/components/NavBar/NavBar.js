import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import './NavBar.css';
import AuthenticationService from './../../../services/Authentication';

class NavBar extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      isOpen: false
    };
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

  logout() {
    AuthenticationService.logout(this.props.history);
  }

  render() {
    return (
        <div>
          <Navbar dark expand="md" className="fixed-top">
            <NavbarBrand href="/">
              <img className='logo' src={process.env.PUBLIC_URL+'/logo.png'} alt='logo' 
                height="40"
              />
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink onClick={this.logout}>Logout</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
          <div className="padding">
          </div>
        </div>
    );
  }
}

export default NavBar;