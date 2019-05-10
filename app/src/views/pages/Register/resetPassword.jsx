import cn from 'classnames'
import React, { Component } from 'react';
import { FormGroup, Input, Alert } from 'reactstrap';
import {Link} from 'react-router-dom'
import axios from 'axios';

import Button from 'components/Button'

class ResetPassword extends Component {

  constructor(props) {
    super(props);

    this.state = {
      password: "",
      confirm: "",
      stage: 0,
      error: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.renderStage = this.renderStage.bind(this);
  }

  componentWillMount(){
    axios.get('/user/reset/' + this.props.match.params.id)
    .then(() => {
      this.setState({
        stage: 1
      })
    })
    .catch(err => {
      if(err.response.status < 500){
        this.setState({
          stage: 4,
          error: 'This Reset Link is Invalid or Expired'
        })
      }else{
        this.setState({
          stage: 4,
          error: 'Whoops, something went wrong with the server'
        })
      }
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  resetPassword(e){
    e.preventDefault()
    if(this.state.password !== this.state.confirm){
      return this.setState({
        error: 'Passwords do not match'
      })
    }

    this.setState({stage: 2})
    axios.post('/user/reset/' + this.props.match.params.id, {
      password: this.state.password
    })
    .then(() => {
      this.setState({
        stage: 3
      })
    })
    .catch(err => {
      this.setState({
        stage: 4,
        error: 'Whoops, something went wrong with the server'
      })
    })
    return false
  }

  renderStage(){
    switch(this.state.stage){
      case 0:
        return <div className="super-center text-center">
              <div>
                <h5 className="pb-3">Checking Token</h5>
                <h1><span className="loader"/></h1>
              </div>
            </div>
      case 1:
        return <form onSubmit={this.resetPassword} className="w-100">
                    {this.state.error && <Alert color="danger" className="text-center">{this.state.error}</Alert>}
                    <h5 className="text-muted">Please Enter Your New Password</h5>
                    <FormGroup>
                      <Input type="password" name="password" onChange={this.handleChange} placeholder="New Password" required minLength="8" className="mb-2"/>
                      <Input type="password" name="confirm" onChange={this.handleChange} placeholder="Confirm Password" required minLength="8"
                        className={cn({
                          invalid: this.state.password !== this.state.confirm
                        })}
                      />
                    </FormGroup>
                    <Button block className="login-btn" type="submit">Reset Password</Button>
                </form>
      case 2:
        return <div className="super-center text-center">
              <div>
                <h5 className="pb-3">Resetting Password</h5>
                <h1><span className="loader"/></h1>
              </div>
            </div>
      case 3:
        return <div className="text-center">
          <Alert color="success">
            Your Password Has Been Reset
          </Alert>
        </div>
      case 4:
        return <div>
          <Alert color="danger" className="text-center">{this.state.error}</Alert>
        </div>
      default:
        return null
    }
  }

  render() {
    return (    
      <div className="d-flex flex-row align-items-center justify-content-center" id="main">
          <div id="side-form">
            <div id="reset-form">
              <img className="login-logo" src="/logo.svg" alt="logo"/>
              <div className="p-4 p-md-5">
                <div className="reset-div">
                  {this.renderStage()}
                </div>
                <hr/>
                <div className="text-center mt-3"><Link to="/login">Return to Login</Link></div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default ResetPassword;
