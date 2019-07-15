import { maintenance } from '@voiceflow/common';
import moment from 'moment';

import { BUILD_ENV, IS_PRODUCTION } from '@/config';

const { MAINTENANCE_START, MAINTENANCE_START_DATE, MAINTENANCE_TIME_MS } = maintenance;
const WARNING_INTERVALS = [60, 30, 10, 5, 1];

export function evaluateMaintenance(action, first = true) {
  if (!IS_PRODUCTION || BUILD_ENV === 'staging') {
    return;
  }

  const farOut = Date.now() - MAINTENANCE_START_DATE;

  if (farOut > 0 && farOut < MAINTENANCE_TIME_MS) {
    action(null);
  } else if (farOut < 0) {
    let i;
    let waitTime = farOut;

    for (i = 0; i < WARNING_INTERVALS.length; i++) {
      const interval = WARNING_INTERVALS[i] * 60 * 1000;
      if (farOut * -1 > interval) {
        waitTime = farOut * -1 - interval;
        break;
      }
    }

    if (i > 0 && !first) {
      action(moment(MAINTENANCE_START).fromNow(true));
    }

    if (i === WARNING_INTERVALS.length) {
      waitTime = farOut * -1;
    }

    setTimeout(() => evaluateMaintenance(action, false), waitTime + 1000);
  }
}
