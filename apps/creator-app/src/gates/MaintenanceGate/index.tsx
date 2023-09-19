import { datadogRum } from '@datadog/browser-rum';
import { Utils } from '@voiceflow/common';
import { Alert } from '@voiceflow/ui';
import { Text, toast } from '@voiceflow/ui-next';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import React from 'react';

import client from '@/client';
import LoadingGate from '@/components/LoadingGate';
import { MAINTENANCE_STATUS_SOURCE } from '@/config';
import { useConfirmModal } from '@/ModalsV2/hooks';
import { getMaintenanceCookie } from '@/utils/cookies';

import MaintenanceController from './MaintenanceController';

// 5 minutes
const MAINTENANCE_CHECK_INTERVAL = 5 * 60 * 1000;
const WARNING_INTERVALS = [60, 30, 10, 5, 1];

const CHECKED_COOKIE = 'd8WMYh2g89';

const WARNING_KEY = 'maintenanceWarning';

const getMaintenance = async () => {
  // TEST TIME INTERVALS (uncomment to override fetched times with hard coded test ISO-ZULU intervals)
  // const minutesFromNow = (minutes = 1) => new Date(Date.now() + minutes * 60 * 1000).toISOString();
  // return { startTimeUtc: minutesFromNow(-10), endTimeUtc: minutesFromNow(-20) };

  const {
    data: { startTimeUtc, endTimeUtc },
  } = await axios.get(`${MAINTENANCE_STATUS_SOURCE}?q=${Utils.id.cuid()}`, { withCredentials: false });

  return { startTimeUtc, endTimeUtc };
};

const MaintenanceGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const confirmModal = useConfirmModal();

  const [checked, updateChecked] = React.useState(false);

  const action = React.useCallback((interval: string | null = null) => {
    if (!interval) {
      window.location.replace('https://voiceflow.com/maintenance');
      throw new Error('MAINTENANCE');
    }

    confirmModal.openVoid({
      header: 'Planned Maintenance',

      body: (
        <Alert>
          Voiceflow Creator will go under planned maintenance
          <br />
          <b>{interval}</b> from now
          <hr />
          Live Assistants will not be affected
        </Alert>
      ),

      confirm: () => {},

      maxWidth: 450,

      cancelButtonText: null,

      confirmButtonText: 'OK',
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
        await client.maintenance.check();
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 503) {
          action();
          return;
        }
      }

      try {
        const { startTimeUtc, endTimeUtc } = await getMaintenance();

        // if it fails to convert these variables will be set to NaN, which are falsy
        const start = Date.parse(startTimeUtc);
        const end = Date.parse(endTimeUtc);

        const maintenanceID = `${start}-${end}`;

        if (start && end) {
          maintenance.evaluateMaintenance(start, end);

          // if maintenance period has already passed, no need for notification
          if (Date.now() < end && localStorage.getItem(WARNING_KEY) !== maintenanceID) {
            localStorage.setItem(WARNING_KEY, maintenanceID);
            toast.warning(
              <Text>
                Voiceflow Creator will go under planned maintenance from
                <strong> {dayjs(start).format('h:mmA, MMM D')}</strong> to <strong>{dayjs(end).format('h:mmA, MMM D')}</strong>
              </Text>,
              { autoClose: false }
            );
          } else if (Date.now() > end) {
            localStorage.removeItem(WARNING_KEY);
          }
        }
      } catch (err) {
        datadogRum.addError(err);
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
    <LoadingGate internalName={MaintenanceGate.name} isLoaded={checked}>
      {children}
    </LoadingGate>
  );
};

export default MaintenanceGate;
