import React, { Component, useState, useEffect} from 'react'
import { Form, FormGroup, Input, Alert } from 'reactstrap'
import { Link } from 'react-router-dom'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login'


const LoginForm = props => {
  const [authError, setAuthError] = useState(null)
  const [loginError, setLoginError] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return (
  <Form id="login-form" onSubmit={this.loginSubmit}>
    <img className="login-logo" src="/logo.svg" alt="logo"/>
    <div className="px-5 pb-5 pt-4">
      <div className="text-center">
        <h4 className="mb-4">Login</h4>
      </div>

      {loginError}
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
          placeholder="Password" required minLength="8" 
          value={password}/>
      </FormGroup>
      <button className="btn-primary btn-lg btn-block" type="submit">Login</button>
      <div className="text-center small mt-2"><Link style={{color:'#8da2b5'}}to='/reset'>Forgot your password?</Link></div>
      <hr/>
      <div className="text-center">Dont have an account? <a href="/signup" onClick={this.openRegister}>Sign Up</a></div>
    </div>
  </Form>
)
}

export default LoginForm