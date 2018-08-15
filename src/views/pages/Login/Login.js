import React, { Component } from 'react';
import AuthenticationService from './../../../services/Authentication';
import { Alert, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      code: "",
      name: "",
      error: false,
      timeout: null
    };

    this.submit=this.submit.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  submit() {
    AuthenticationService.login(this.state.name, this.state.password, (error) => {
      if(error){
        this.setState({error: true});
        if(this.state.timeout){
          clearTimeout(this.state.timeout);
        }
        this.setState({timeout: setTimeout(function() {
          this.setState({error: false});
        }.bind(this), 5000)})
      }else{
        AuthenticationService.check((error) => {
          if(!error){
            this.props.history.push('/');
          }
        })
      }
    });
  }

  render() {
    let error;
    if(this.state.error){
      error = (<Alert color="danger"> Invalid Login </Alert>);
    }
    return (
      <div className="app d-flex flex-row align-items-center h-100">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Admin Login</h1>
                    <p className="text-muted">Sign In to Admin Access</p>
                    {error}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" required placeholder="Name" name="name" value={this.state.name} onChange={this.handleChange}/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fas fa-star-of-life"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" required placeholder="Admin Code" name="code" value={this.state.code} onChange={this.handleChange}/>
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button color="primary" className="px-4" onClick={this.submit}>Login</Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;