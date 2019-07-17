import './Socket';
// Import Dependent CSS
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fontawesome/css/all.min.css';
import './App.css';
import 'react-day-picker/lib/style.css';

import { ConnectedRouter } from 'connected-react-router';
import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReactGA from 'react-ga';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { Alert } from 'reactstrap';
import { compose } from 'recompose';
import { ThemeProvider } from 'styled-components';

import ConfirmModal from '@/components/Modals/ConfirmModal';
import ErrorModal from '@/components/Modals/ErrorModal';
import Modal from '@/components/Modals/Modal';
import Spinner from '@/components/Spinner';
import { getAuth, getUser } from '@/ducks/account';
import { history } from '@/store/store';
import { evaluateMaintenance } from '@/utils/maintenance';

import allRoutes from './Routes/allRoutes';
import Alerts from './components/Alerts/Alerts';
import theme from './styles/theme';

ReactGA.initialize('UA-124745244-3');
toast.configure({
  autoClose: 2000,
  draggable: false,
  pauseOnFocusLoss: false,
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: !!getAuth(),
      session: false,
      stripe: null,
    };

    if (this.state.loading) {
      this.props
        .getUser()
        .then(() =>
          this.setState({
            session: true,
            loading: false,
          })
        )
        .catch((err) => {
          // eslint-disable-next-line no-console
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
        setTimeout(
          () =>
            this.props.setConfirm({
              size: 'rg',
              text: (
                <Alert className="mb-0">
                  Voiceflow Creator will go under planned maintenance
                  <br />
                  <b>{time}</b> from now
                  <hr />
                  Live Projects will not be affected
                </Alert>
              ),
            }),
          100
        );
      } else {
        window.location.replace('https://voiceflow.com/maintenance');
        // eslint-disable-next-line xss/no-location-href-assign
        window.location.href = 'https://voiceflow.com/maintenance';
        throw new Error('MAINTENANCE');
      }
    });
  }

  render() {
    if (this.state.loading) return <Spinner name="Account" />;

    return (
      <ThemeProvider theme={theme}>
        <div id="body">
          <ConnectedRouter history={history}>
            <ConfirmModal />
            <ErrorModal />
            <Modal />
            <Alerts />
            <ToastContainer />
            {allRoutes}
          </ConnectedRouter>
        </div>
      </ThemeProvider>
    );
  }
}

// Hack until this ticket is fixed https://github.com/react-dnd/react-dnd/issues/894
global.__isReactDndBackendSetUp = false; // eslint-disable-line no-underscore-dangle

export default compose(
  hot,
  connect(
    null,
    {
      getUser,
    }
  ),
  // eslint-disable-next-line xss/no-mixed-html
  DragDropContext(HTML5Backend)
)(App);
