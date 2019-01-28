import Cookies from 'universal-cookie'
import axios from 'axios'
import {getDevice} from 'Helper'

const cookies = new Cookies()
cookies.remove('last_session')

window.user_detail = {
	email: null,
	name: null,
	id: null,
	admin: 0
}

let appId = "amzn1.application-oa2-client.582f261a95e1447894d13a4fe2a1c72e";

var options={response_type:"code", scope:"alexa::ask:skills:readwrite alexa::ask:models:readwrite alexa::ask:skills:test"}

const load = () => new Promise((resolve) => {
  // @TODO: handle errors
  if (document.getElementById('amazon-sdk')) {
    return resolve()
  }

  const firstJS = document.getElementsByTagName('script')[ 0 ]
  const js = document.createElement('script')

  js.src = '//api-cdn.amazon.com/sdk/login1.js'
  js.id = 'amazon-sdk'
  js.async = true

  window.onAmazonLoginReady = () => {
    window.amazon.Login.setClientId(appId)

    return resolve()
  }

  if (!firstJS) {
    document.appendChild(js)
  } else {
    firstJS.parentNode.appendChild(js)
  }
})

/**
 * Checks if user is logged in to app through Amazon.
 * Requires SDK to be loaded first.
 * @see https://developer.amazon.com/public/apis/engage/login-with-amazon/docs/javascript_sdk_reference.html#authorize
 */
const login = () => new Promise((resolve, reject) => {
  	window.amazon.Login.authorize(options, (response) => {
	    if (response.error) {
	      	reject()
	    }else{
	    	axios.get('/session/amazon/' + response.code)
	    	.then(res => {
	    		resolve();
	    	})
	    	.catch(err => {
	    		console.error(err);
	    		reject(err);
	    	});
	    }
  	})
})

const initalizeLogin = (response, cb) => {
	cookies.set('auth', response.data.token, {path: '/'});
	cookies.remove('last_session');
	window.user_detail = response.data.user;
	window.CreatorSocket.emit('handshake', {
		auth: response.data.token,
		device: getDevice()
	}, () => {window.CreatorSocket.status = 'HANDSHAKE'})
	cb(null, response.data.user)
}

export default {
	amazon_load: load,
	amazon_login: login,
	accountType: () => {
		return window.user_detail.admin;
	},
	getUser: () => {
		return window.user_detail;
	},
	isAuth: () => {
		return !!cookies.get('auth', {path: '/'})
		// return window.user_detail.id !== null;
	},
	getAuth: () => {
		return cookies.get('auth', {path: '/'})
	},
	AmazonAccessToken: cb => {
		axios.get('/session/amazon/access_token')
		.then(res => {
			cb(true);
		})
		.catch(err => {
			// console.error(err);
			cb(null);
		});
	},
	check: (cb) => {
		// req.user on backend will contain user info if
		// this person has credentials that are valid
		axios.get('/session')
		.then(response => {
			window.user_detail = response.data;
	      	cb(false, response.data);
	    })
	    .catch(err => {
	    	window.user_detail = {
				email: null,
				name: null,
				id: null,
				admin: 0
			}
			cookies.remove('auth', {path: '/'});
	      	cb(err, null);
	    });
	},
	logout: (cb) => {
		localStorage.clear()
		window.user_detail = {
			email: null,
			name: null,
			id: null,
			admin: 0
		}
		axios.delete('/session')
		.then(response => {
			cookies.remove('auth', {path: '/'});
			if(cb){
				cb();
			}
		})
		.catch(err => {
			cookies.remove('auth', {path: '/'});
			if(cb){
				cb();
			}
		})
	},
	signup: (user, cb) => {
	    axios.put('/user', {user: user, device: getDevice()})
	    .then(response => initalizeLogin(response, cb))
	    .catch(err => {
	    	cb(err);
	    });
	},
	login: (user, cb) => {
	    axios.put('/session', {user: user, device: getDevice()})
	    .then(response => initalizeLogin(response, cb))
	    .catch(err => {
	    	cb(err);
	    });
	},
	googleLogin: (user, cb) => {
		axios.put('/googleLogin', {user: user, device: getDevice()})
		.then(response => initalizeLogin(response, cb))
		.catch(err => {
			cb(err);
		})
	},
	fbLogin: (user, cb) => {
		axios.put('/fbLogin', {user: user, device: getDevice()})
		.then(response => initalizeLogin(response, cb))
		.catch(err => {
			cb(err);
		})
	},
	googlePublishLogin: (user_code) => new Promise((resolve, reject) => {
		axios.put('/googlePublishLogin', user_code)
		.then(() => {
			resolve()
		})
		.catch(err => {
			reject(err);
		})
	}),
	googleAccessToken: () => new Promise((resolve, reject) => {
		axios.get('/session/google/access_token')
		.then(res => {
			resolve(!!(res.data && res.data.token))
		})
		.catch(() => {
			reject('Error with checking access token');
		});
	}),
	verifyGoogleToken: (token) => new Promise((resolve, reject) => {
		axios.post('/session/google/verify_token', {
			token: token,
		})
		.then(res => {
			resolve(res)
		})
		.catch(() => {
			reject('Invalid access token, please try again');
		});
	})
}
