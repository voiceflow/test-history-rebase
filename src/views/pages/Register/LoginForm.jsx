import React, { useState, useEffect } from 'react'
import { Form, FormGroup, Input } from 'reactstrap'
import { Link } from 'react-router-dom'
import SocialLogin from './SocialLogin'
import ErrorWidget from './ErrorWidget';
import queryString from 'query-string'
import { login } from 'ducks/account'
import { connect } from 'react-redux'

export const LoginForm = ({login, history, location}) => {
  let query = queryString.parse(location.search)
  const [loginError, setLoginError] = useState(null)
  const [email, setEmail] = useState(query.email ? query.email : "")
  const [password, setPassword] = useState("")
  const [unverified] = useState(false)
  const [errorColor, setErrorColor] = useState("danger")
  let timeout

  const openRegister = e => {
    e.preventDefault()
    history.push('/signup' + location.search);
    return false;
  }

  const loginSubmit = (e) => {
    e.preventDefault();
    login({
      email,
      password,
    })
    .catch(err => {
        const errText = (err && err.response && err.response.data) ||
                        (unverified ? "Please verify your email to use Facebook login" : false)
        const errColor = unverified ? "success" : "danger"
        setLoginError(errText)
        setErrorColor(errColor)
    })
    return false;
  }

  useEffect(() => {
    timeout = setTimeout(() => {
      setLoginError(false)
    }, 5000)

    return () => clearTimeout(timeout)
  })

  return (
  <Form id="login-form" onSubmit={loginSubmit}>
    <img className="login-logo" src="/logo.svg" alt="logo"/>
    <div className="px-5 pb-5 pt-4">
      <div className="text-center">
        <h4 className="mb-4">Login</h4>
      </div>
      <SocialLogin entryText={"Login"} />
      <ErrorWidget color={errorColor} error={loginError} />
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
      <button 
        className="btn-primary btn-lg btn-block" 
        type="submit">
          Login
        </button>
      <div className="text-center small mt-2">
        <Link style={{color:'#8da2b5'}}to='/reset'>
          Forgot your password?
        </Link>
      </div>
      <hr/>
      <div className="text-center">Dont have an account?  
      <a href="/signup" onClick={openRegister}> Sign Up</a>
      </div>
    </div>
  </Form>
)
}

const mapDispatchToProps = dispatch => ({
  login: (user) => dispatch(login(user)),
})

export default connect(null, mapDispatchToProps)(LoginForm)