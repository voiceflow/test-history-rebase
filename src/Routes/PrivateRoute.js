import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { getAuth } from '../ducks/account';
import ErrorBoundary from '../ErrorBoundary';

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props =>
		!getAuth() ? (
			<Redirect to={{
				pathname: '/login',
				search: props.location.search,
				state: { from: props.location }
			}}/>
		) : (
			<ErrorBoundary>
				<Component {...props} {...rest}/>
			</ErrorBoundary>
		)
	}
	/>
);

export default connect(null, { getAuth })(PrivateRoute);
