import axios from 'axios'
import Cookies from 'universal-cookie'
import {getDevice} from 'Helper'
import {push} from 'connected-react-router'
import queryString from 'query-string'
// import { setError } from 'ducks/modal'

export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT'
export const RESET_ACCOUNT = 'RESET_ACCOUNT'

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
    case UPDATE_ACCOUNT:
      return {
        ...state,
        ...action.payload
      }
    case RESET_ACCOUNT:
      return initialState
    default:
      return state
  }
}

// ACTIONS
const resetAccount = () => ({
  type: RESET_ACCOUNT
}) 

export const updateAccount = (payload) => ({
  type: UPDATE_ACCOUNT,
  payload: payload
})

export const checkSession = () => {
  return async dispatch => {
    try {
      let user = (await axios.get('/session')).data
      dispatch(updateAccount(user))
      return Promise.resolve(user)
    } catch(err) {
      cookies.remove('auth', {path: '/'})
      dispatch(resetAccount())
      return Promise.reject(err)
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
      return Promise.reject(err)
    }
  }
}

export const logout = () => {
  return async dispatch => {
    try {
      await axios.delete('/session')
    } catch(err) {
      console.error(err)
    }
    cookies.remove('auth', {path: '/'});
    localStorage.clear()
    dispatch(resetAccount())
    
    return Promise.resolve()
  }
}

const createSession = (endpoint) => {
  return (user) => {
    return async (dispatch, getState) => {
      try {
        let data = (await axios.put(endpoint, {user: user, device: getDevice()})).data
        if(data.user.id){
          data.user.creator_id = data.user.id
          delete data.user.id
        }

        cookies.set('auth', data.token, {path: '/'});
        cookies.remove('last_session');

        dispatch(updateAccount(data.user))

        const location = getState().router.location
        const search = queryString.parse(location.search)

        if(search.invite || !data.user.first_login){
          dispatch(push({
            pathname: '/dashboard',
            search: location.search,
            state: { from: location } 
          }))
        } else {
          localStorage.setItem('is_first_upload', 'true')
          localStorage.setItem('is_first_session', 'true')
          dispatch(push('/onboarding'))
        }
    
        if (window.Appcues) {
          window.Appcues.identify(data.user.creator_id, {
            email: user.email,
            name: user.name
          })
        }

        return Promise.resolve()
      } catch(err) {
        return Promise.reject(err)
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

export const dialogflowToken = (project_id) => new Promise((resolve, reject) => {
  axios.get(`/session/google/dialogflow_access_token/${project_id}`)
  .then(res => resolve(!!(res.data && res.data.token)))
  .catch(err => reject(err))
})

export const verifyGoogleToken = (token) => new Promise((resolve, reject) => {
  axios.post('/session/google/verify_token', {token: token})
  .then(res => resolve(res))
  .catch(err => reject(err))
})

export const getVendors = () => new Promise((resolve, reject) => {
  axios.get('/session/vendor?all=true')
  .then(res => resolve(res.data))
  .catch(err => reject(err))
})
