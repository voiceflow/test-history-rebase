import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { store, history } from './containers/store';
import { Alert } from 'reactstrap';
import { ConnectedRouter } from 'connected-react-router';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Socket from './Socket';

// Import Dependent CSS
import 'react-tippy/dist/tippy.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fontawesome/css/all.min.css';
import './App.css';
import 'react-day-picker/lib/style.css';

import { evaluateMaintenance } from './MAINTENANCE';

// GLOBAL MODALS
import { setConfirm } from 'ducks/modal';
import ConfirmModal from 'components/Modals/ConfirmModal';
import ErrorModal from 'components/Modals/ErrorModal';
import Modal from 'components/Modals/Modal';

import { getAuth, getUser } from 'ducks/account';
import allRoutes from './Routes/allRoutes';

ReactGA.initialize('UA-124745244-3');

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: !!getAuth(),
			session: false,
			stripe: null,
		};

		if (this.state.loading) {
			store.dispatch(getUser())
				.then(() => this.setState({
					session: true,
					loading: false
				}))
				.catch(err => {
					console.log(err);
					this.setState({ loading: false });
					history.push('/login');
				});
		}

		history.listen((location) => {
			ReactGA.set({ page: location.pathname });
			ReactGA.pageview(location.pathname);
			this.setState({ session: !!getAuth() });
		});

		// REDIRECT TO MAINTENANCE
		evaluateMaintenance((time) => {
			if (time) {
				setTimeout(() => store.dispatch(setConfirm({
					size: 'rg',
					text: <Alert className="mb-0">
						Voiceflow Creator will go under planned maintenance<br/>
						<b>{time}</b> from now
						<hr/>
						Live Projects will not be affected</Alert>
				})), 100);
			} else {
				window.location.replace('https://getvoiceflow.com/maintenance');
				window.location.href = 'https://getvoiceflow.com/maintenance';
				throw new Error('MAINTENANCE');
			}
		});
	}

	render() {
		if (this.state.loading) {
			return (
				<div id="loading-diagram">
					<div className="text-center">
						<h5 className="text-muted mb-2">Loading Account...</h5>
						<span className="loader"/>
					</div>
				</div>
			);
		}
		return (
			<div id="body">
				<Socket />
				<ConnectedRouter history={history}>
						<ConfirmModal/>
						<ErrorModal/>
						<Modal/>
						{allRoutes}
				</ConnectedRouter>
			</div>
		);
	}
}

// Hack until this ticket is fixed https://github.com/react-dnd/react-dnd/issues/894
global.__isReactDndBackendSetUp = false;

export default compose(
	connect(null, {
		getUser
	}),
	DragDropContext(HTML5Backend)
)(App);
