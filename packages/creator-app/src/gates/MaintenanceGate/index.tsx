import { Alert } from '@voiceflow/ui';
import axios from 'axios';
import cuid from 'cuid';
import dayjs from 'dayjs';
import _noop from 'lodash/noop';
import React from 'react';
import { connect } from 'react-redux';

import LoadingGate from '@/components/LoadingGate';
import { MAINTENANCE_STATUS_SOURCE } from '@/config';
import * as Modal from '@/ducks/modal';
import * as Notifications from '@/ducks/notifications';
import { ConnectedProps } from '@/types';
import { getMaintenanceCookie } from '@/utils/cookies';
import * as Sentry from '@/vendors/sentry';

import MaintenanceController from './MaintenanceController';

// 5 minutes
const MAINTENANCE_CHECK_INTERVAL = 5 * 60 * 1000;
const WARNING_INTERVALS = [60, 30, 10, 5, 1];

const CHECKED_COOKIE = 'd8WMYh2g89';

const getMaintenance = async () => {
  // TEST TIME INTERVALS (uncomment to override fetched times with hard coded test ISO-ZULU intervals)
  // const minutesFromNow = (minutes = 1) => new Date(Date.now() + minutes * 60 * 1000).toISOString();
  // return { startTimeUtc: minutesFromNow(-10), endTimeUtc: minutesFromNow(-20) };

  const {
    data: { startTimeUtc, endTimeUtc },
  } = await axios.get(`${MAINTENANCE_STATUS_SOURCE}?q=${cuid()}`, { withCredentials: false });

  return { startTimeUtc, endTimeUtc };
};

const MaintenanceGate: React.FC<ConnectedMaintenanceGateProps> = ({ children, setConfirm, forceNotification }) => {
  const [checked, updateChecked] = React.useState(false);

  const action = React.useCallback((interval = null) => {
    if (!interval) {
      window.location.replace('https://voiceflow.com/maintenance');
      throw new Error('MAINTENANCE');
    }

    setConfirm({
      size: 'rg',
      text: (
        <Alert mb={0}>
          Voiceflow Creator will go under planned maintenance
          <br />
          <b>{interval}</b> from now
          <hr />
          Live Projects will not be affected
        </Alert>
      ),
    });
  }, []);

  React.useEffect(() => {
    const maintenance = new MaintenanceController(action, WARNING_INTERVALS);

    const checkMaintenance = async () => {
      if (getMaintenanceCookie() === CHECKED_COOKIE) {
        updateChecked(true);
        return;
      }

      // additional failsafe - call an arbitrary api endpoint to ensure API isn't in maintenance
      try {
        await axios.get('/maintenance');
      } catch (err) {
        if (err?.response?.status === 503) {
          action();
          return;
        }
      }

      try {
        const { startTimeUtc, endTimeUtc } = await getMaintenance();

        // if it fails to convert these variables will be set to NaN, which are falsy
        const start = Date.parse(startTimeUtc);
        const end = Date.parse(endTimeUtc);

        if (start && end) {
          maintenance.evaluateMaintenance(start, end);

          // if maintenance period has already passed, no need for notification
          if (Date.now() < end) {
            forceNotification({
              id: 'maintenance',
              type: Notifications.NotificationType.UPDATE,
              created: dayjs(start).toString(),
              details: `Voiceflow Creator will go under planned maintenance from _**${dayjs(start).format('h:mmA, MMM Do')}**_ to _**${dayjs(
                end
              ).format('h:mmA, MMM Do')}**_`,
            });
          }
        }
      } catch (err) {
        Sentry.error(err);
      }

      updateChecked(true);
    };

    checkMaintenance();

    const maintenanceInterval = setInterval(checkMaintenance, MAINTENANCE_CHECK_INTERVAL);

    return () => {
      clearInterval(maintenanceInterval);
    };
  }, []);

  return (
    <LoadingGate load={_noop} isLoaded={checked}>
      {children}
    </LoadingGate>
  );
};

const mapDispatchToProps = {
  setConfirm: Modal.setConfirm,
  forceNotification: Notifications.forceNotificationIfNew,
};

type ConnectedMaintenanceGateProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(MaintenanceGate);
