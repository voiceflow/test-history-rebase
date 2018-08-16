import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();

export default {
	isAuth: () => {
		return !!cookies.get('auth');
	},
	check: (cb) => {
		// req.user on backend will contain user info if
		// this person has credentials that are valid
		axios.get('/session')
		.then((response) => {
	      	cb(false, response.data);
	    })
	    .catch((error) => {
	    	cookies.remove('auth');
	      	cb(error, null);
	    });
	},
	logout: (history) => {
		axios.delete('/session');
		cookies.remove('auth');
		if(history){
			history.push('/');
		}
	},
	signup: (user, cb) => {
	    axios.put('/user', user)
	    .then((response) => {
	    	cookies.set('auth', response.data);
	    	cb(null);
	    })
	    .catch((error) => {
	    	cb(error);
	    });
	},
	login: (user, cb) => {
	    axios.put('/session', user)
	    .then((response) => {
	    	cookies.set('auth', response.data);
	    	cb(null);
	    })
	    .catch((error) => {
	    	cb(error);
	    });
	},
}