import axios from 'axios';
import _ from 'lodash';
import randomstring from 'randomstring';
import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';

import LoadingGate from '@/admin/Routes/LoadingGate';
import { MAINTENANCE_STATUS_SOURCE } from '@/config';
import { setConfirm } from '@/ducks/modal';
import { getMaintenanceCookie } from '@/utils/cookies';

import MaintenanceController from './MaintenanceController';

// 5 minutes
const MAINTENANCE_CHECK_INTERVAL = 5 * 60 * 1000;

const getMaintenance = async () => {
  const {
    data: { startTimeUtc, endTimeUtc },
  } = await axios.get(`${MAINTENANCE_STATUS_SOURCE}?q=${randomstring.generate()}`, {
    withCredentials: false,
  });

  // TEST TIME INTERVALS (uncomment to override fetched times with hard coded test ISO-ZULU intervals)
  // const minutesFromNow = (minutes = 1) => new Date(Date.now() + minutes * 60 * 1000).toISOString();
  // return { startTimeUtc: minutesFromNow(1), endTimeUtc: minutesFromNow(60) };

  return { startTimeUtc, endTimeUtc };
};

class MaintenanceGate extends React.Component {
  state = {
    checked: false,
  };

  action = (interval = null) => {
    if (interval) {
      this.props.setConfirm({
        size: 'rg',
        text: (
          <Alert className="mb-0">
            Voiceflow Creator will go under planned maintenance
            <br />
            <b>{interval}</b> from now
            <hr />
            Live Projects will not be affected
          </Alert>
        ),
      });
    } else {
      window.location.replace('https://voiceflow.com/maintenance');
      throw new Error('MAINTENANCE');
    }
  };

  maintenance = new MaintenanceController(this.action);

  checkMaintenance = async () => {
    // TODO: use environment variable check
    if (getMaintenanceCookie() === 'd8WMYh2g89') {
      return this.setState({
        checked: true,
      });
    }

    // additional failsafe - call an arbitrary api endpoint to ensure API isn't in maintenance
    try {
      await axios.get('/maintenance');
    } catch (err) {
      if (_.get(err, ['response', 'status']) === 503) {
        return this.action();
      }
    }

    try {
      const { startTimeUtc, endTimeUtc } = await getMaintenance();

      // if it fails to convert these variables will be set to NaN, which are falsy
      const start = Date.parse(startTimeUtc);
      const end = Date.parse(endTimeUtc);

      if (start && end) {
        this.maintenance.evaluateMaintenance(start, end);
      }
    } catch (err) {
      console.error(err);
    }

    this.setState({
      checked: true,
    });
  };

  componentDidMount() {
    this.maintenanceInterval = setInterval(this.checkMaintenance, MAINTENANCE_CHECK_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.maintenanceInterval);
  }

  render() {
    const { children } = this.props;
    const { checked } = this.state;
    return (
      <LoadingGate load={this.checkMaintenance} isLoaded={checked}>
        {children}
      </LoadingGate>
    );
  }
}

export default connect(
  null,
  { setConfirm }
)(MaintenanceGate);
