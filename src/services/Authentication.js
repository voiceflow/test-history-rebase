import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();

const default_user = {
		email: null,
		name: null,
		id: null,
		admin: false
};

declare var user_detail;

window.user_detail = default_user;

let appId = "amzn1.application-oa2-client.582f261a95e1447894d13a4fe2a1c72e";

var options={response_type:"code", scope:"alexa::ask:skills:readwrite alexa::ask:models:readwrite"}

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
const checkLogin = () => new Promise((resolve, reject) => {
  window.amazon.Login.authorize(options, (response) => {
    if (response.error) {
      return reject({
        provider: 'amazon',
        type: 'auth',
        description: 'Authentication failed',
        error: response
      })
    }

    console.log(response);
    resolve('yeet');
  })
})

/**
 * Trigger Amazon login process.
 * Requires SDK to be loaded first.
 */
const login = () => new Promise((resolve, reject) => {
  return checkLogin().then(resolve, reject)
})

/**
 * Trigger Amazon logout.
 * Requires SDK to be loaded first.
 * @see https://developer.amazon.com/docs/login-with-amazon/javascript-sdk-reference.html#logout
 */
const logout = () => new Promise((resolve) => {
  window.amazon.Login.logout()
  return resolve()
})

export default {
	amazon_load: load,
	amazon_login: login,
	isAdmin: () => {
		return user_detail.admin;
	},
	getUser: () => {
		return window.user_detail;
	},
	isAuth: () => {
		return !!cookies.get('auth');
	},
	Amazon: () => {
		return window.user_detail.amazon && (window.user_detail.amazon.expiry < Date.now());
	},
	check: (cb) => {
		// req.user on backend will contain user info if
		// this person has credentials that are valid
		axios.get('/session')
		.then((response) => {
			window.user_detail = response.data;
	      	cb(false, response.data);
	    })
	    .catch((error) => {
	    	cookies.remove('auth');
	      	cb(error, null);
	    });
	},
	logout: (cb) => {
		window.user_detail = default_user;
		axios.delete('/session')
		.then((response) => {
			cookies.remove('auth');
			if(cb){
				cb();
			}
		})
		.catch((error) => {
			cookies.remove('auth');
			if(cb){
				cb();
			}
		});
	},
	signup: (user, cb) => {
	    axios.put('/user', user)
	    .then((response) => {
	    	cookies.set('auth', response.data.token);
	    	window.user_detail = response.data.user;
	    	cb(null);
	    })
	    .catch((error) => {
	    	cb(error);
	    });
	},
	login: (user, cb) => {
	    axios.put('/session', user)
	    .then((response) => {
	    	cookies.set('auth', response.data.token);
	    	window.user_detail = response.data.user;
	    	cb(null);
	    })
	    .catch((error) => {
	    	cb(error);
	    });
	}
}