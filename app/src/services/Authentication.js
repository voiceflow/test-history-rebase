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
		axios.get('/me')
		.then((response) => {
	      	cb(false);
	    })
	    .catch((error) => {
	      	cb(error)
	    });
	},
	logout: (history) => {
		cookies.remove('auth');
		if(history){
			history.push('/login');
		}
	}
}