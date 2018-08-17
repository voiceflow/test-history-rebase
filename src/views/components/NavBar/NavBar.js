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
import {Link} from 'react-router-dom';

import './NavBar.css';
import AuthenticationService from './../../../services/Authentication';

class NavBar extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      isOpen: false,
      tabs: [
        {link: 'StoryBoard', 'text': 'StoryBoard <i class="fas fa-edit"></i>'}, 
        {link: 'Admin', text: 'Admin <i class="fas fa-columns"></i>'}
      ],
      email: null
    };
  }

  componentDidMount() {
      AuthenticationService.check((err, res) => {
          console.log(res);
          this.setState({ email: res });
      });
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
                height="30"
              />
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="mr-auto" navbar>
                {this.state.tabs.map(function(tab, i){
                    if(this.props.name === tab.link){
                      return (
                        <NavItem active key={i}>
                          <NavLink dangerouslySetInnerHTML={{__html: tab.text}}></NavLink>
                        </NavItem>)
                    }else{
                      return (
                        <NavItem key={i}>
                          <Link to={"/" + tab.link} className="nav-link" dangerouslySetInnerHTML={{__html: tab.text}}></Link>
                        </NavItem>)
                    }
                }.bind(this))}
              </Nav>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink>{this.state.email}</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={this.logout}>Logout</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
          {this.props.padding ? (<div className="padding"></div>) : null}
        </div>
    );
  }
}

export default NavBar;