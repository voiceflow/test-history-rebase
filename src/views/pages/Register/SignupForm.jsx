import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import queryString from "query-string";
import { Form, FormGroup, Input } from 'reactstrap'
import { Link } from 'react-router-dom'

import Button from 'components/Button'
import SocialLogin from './SocialLogin'
import ErrorWidget from './ErrorWidget';

import { signup } from 'ducks/account'

export const SignupForm = ({signup, history, location}) => {
  let query = queryString.parse(location.search)
  const [signupError, setSignupError] = useState(null)
  const [email, setEmail] = useState(query.email ? query.email : "")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  let timeout

  const openLogin = e => {
    e.preventDefault()
    history.push('/login' + location.search);
    return false;
  }

  const signupSubmit = e => {
    e.preventDefault();
    signup({
      name,
      email,
      password,
    })
    .catch(err => {
      setSignupError(err.response.data)
    })
    return false;
  }

  useEffect(() => {
    timeout = setTimeout(() => {
      setSignupError(false)
    }, 5000)

    return () => clearTimeout(timeout)
  })


  return (
  <Form id="signup-form" onSubmit={signupSubmit}>
    <img className="login-logo" src="/logo.svg" alt="logo"/>
    <div className="px-5 pb-5 pt-4">
      <div className="text-center">
        <h4 className="mb-4">Sign Up</h4>
      </div>
      <SocialLogin entryText={"Sign up"} />
      <ErrorWidget color={"danger"} error={signupError} />
      <FormGroup>
        <Input
          className="form-bg"
          type="text"
          name="name"
          onChange={e => setName(e.target.value)}
          placeholder="Full Name"
          required minLength="3"
          value={name}/>
      </FormGroup>
      <FormGroup>
        <Input
          className="form-bg"
          type="email"
          name="email"
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required minLength="6"
          value={email}/>
      </FormGroup>
      <FormGroup>
        <Input
          className="form-bg"
          type="password"
          name="password"
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required minLength="8"
          value={password}/>
      </FormGroup>
      <Button
        isPrimary
        isLarge
        isBlock
        type="submit">
          Create Account
        </Button>
      <div className="text-center small mt-2">
        <Link style={{color:'#8da2b5'}}to='/reset'>
          Forgot your password?
        </Link>
      </div>
      <hr/>
      <div className="text-center">Already have an account?
      <a href="/signup" onClick={openLogin}>  Login</a>
      </div>
    </div>
  </Form>
)
}

const mapDispatchToProps = dispatch => ({
  signup: (user) => dispatch(signup(user)),
})

export default connect(null, mapDispatchToProps)(SignupForm)

