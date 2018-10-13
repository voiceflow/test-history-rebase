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

export default {
	isAdmin: () => {
		return user_detail.admin;
	},
	getUser: () => {
		return window.user_detail;
	},
	isAuth: () => {
		return !!cookies.get('auth');
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