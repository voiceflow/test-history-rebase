import axios from 'axios'
import Cookies from 'universal-cookie'
import {getDevice} from 'Helper'
// import { setError } from 'ducks/modal'

const cookies = new Cookies()
const initialState = {
  loading: false,
  email: null,
	name: null,
	creator_id: null,
  admin: 0,
  image: null
}

// REDUCER
export default function accountReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        ...action.payload
      }
    case 'RESET_ACCOUNT':
      return initialState
    default:
      return state
  }
}

// ACTIONS
const resetAccount = () => ({
  type: 'RESET_ACCOUNT'
}) 

export const updateAccount = (payload) => ({
  type: 'UPDATE_ACCOUNT',
  payload: payload
})

const initalizeLogin = (user, token) => {
  return dispatch => {
    cookies.set('auth', token, {path: '/'});
    cookies.remove('last_session');
    
    dispatch(updateAccount(user))

    if (window.Appcues) {
      window.Appcues.identify(user.id, {
        email: user.email,
        name: user.name,
        roles: user.admin
      })
    }
    return Promise.resolve(user)
  }
}

export const checkSession = () => {
  return async dispatch => {
    try {
      let user = (await axios.get('/session')).data
      dispatch(updateAccount(user))
      return Promise.resolve(user)
    } catch(err) {
      cookies.remove('auth', {path: '/'})
      dispatch(resetAccount())
      return Promise.reject()
    }
  }
}

export const getUser = () => {
  return async dispatch => {
    try {
      let user = (await axios.get('/user')).data
      dispatch(updateAccount(user))
      return Promise.resolve(user)
    } catch(err) {
      cookies.remove('auth', {path: '/'})
      dispatch(resetAccount())
      return Promise.reject()
    }
  }
}

export const logout = () => {
  return async dispatch => {
    localStorage.clear()
    dispatch(resetAccount())

    try {
      await axios.delete('/session')
    } catch(err) {
      console.error(err)
    }
    cookies.remove('auth', {path: '/'});
    return Promise.resolve()
  }
}

const createSession = (endpoint) => {
  return (user) => {
    return async dispatch => {
      try {
        let data = (await axios.put(endpoint, {user: user, device: getDevice()})).data
        dispatch(initalizeLogin(data.user, data.token))
        return Promise.resolve(data.user)
      } catch(err) {
        console.error(err)
        return Promise.reject()
      }
    }
  }
}

export const signup = createSession('/user')
export const login = createSession('/session')
export const googleLogin = createSession('/googleLogin')
export const fbLogin = createSession('/fbLogin')

// Non Action functions
export const getAuth = () => { return cookies.get('auth', {path: '/'}) }

export const AmazonAccessToken = () => new Promise((resolve, reject) => {
  axios.get('/session/amazon/access_token')
  .then(res => resolve(res.data))
  .catch(err => reject(err))
})

export const googleAccessToken = () => new Promise((resolve, reject) => {
  axios.get(`/session/google/access_token`)
  .then(res => resolve(!!(res.data && res.data.token)))
  .catch(err => reject(err))
})

export const dialogflowToken = (skill_id) => new Promise((resolve, reject) => {
  axios.get(`/session/google/dialogflow_access_token/${skill_id}`)
  .then(res => resolve(!!(res.data && res.data.token)))
  .catch(err => reject(err))
})

export const verifyGoogleToken = (token) => new Promise((resolve, reject) => {
  axios.post('/session/google/verify_token', {token: token})
  .then(res => resolve(res))
  .catch(err => reject(err))
})
