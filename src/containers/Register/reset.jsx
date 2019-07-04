import axios from 'axios';
import Button from 'components/Button';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert, FormGroup, Input } from 'reactstrap';

class Reset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      stage: 0,
      error: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.resetEmail = this.resetEmail.bind(this);
    this.renderStage = this.renderStage.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  resetEmail(e) {
    const { email } = this.state;
    e.preventDefault();
    this.setState({ stage: 1 });
    axios
      .post('/user/reset', {
        email,
      })
      .then(() => {
        this.setState({ stage: 2 });
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          this.setState({
            error: 'Too many password reset attempts - Wait 24 hours before the next attempt',
            stage: 0,
          });
        } else {
          this.setState({
            error: 'Something went wrong, please wait and retry or contact support',
            stage: 0,
          });
        }
      });
    return false;
  }

  renderStage() {
    const { stage, error } = this.state;
    switch (stage) {
      case 0:
        return (
          <form onSubmit={this.resetEmail} className="w-100">
            {error && (
              <Alert color="danger" className="text-center">
                {error}
              </Alert>
            )}
            <h5 className="text-muted">Enter your account email</h5>
            <FormGroup>
              <Input type="email" name="email" onChange={this.handleChange} placeholder="jeff@amazon.com" required minLength="6" />
            </FormGroup>
            <Button block className="login-btn" type="submit">
              Send Reset Email
            </Button>
          </form>
        );
      case 1:
        return (
          <div className="super-center text-center">
            <div>
              <h5 className="pb-3">Sending Email</h5>
              <h1>
                <span className="loader" />
              </h1>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <Alert color="success">If an Account is associated with the Email, a reset link has been sent</Alert>
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="d-flex flex-row align-items-center justify-content-center" id="main">
        <div id="side-form">
          <div id="reset-form">
            <img className="login-logo" src="/logo.png" alt="logo" />
            <div className="p-4 p-md-5">
              <div className="reset-div">{this.renderStage()}</div>
              <hr />
              <div className="text-center mt-3">
                <Link to="/login">Return to Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reset;
