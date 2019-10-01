import moment from 'moment';

const WARNING_INTERVALS = [60, 30, 10, 5, 1];

// evaluates maintenance intervals and calls a given action callback at appropriate interavals
class MaintenanceController {
  start = -1;

  end = -1;

  timeout = null;

  constructor(action) {
    this.action = action;
  }

  maintenanceInterval = (first = true) => {
    // how far out the maintenance is (negative if during maintanence)
    const farOut = this.start - Date.now();
    const farOutEnd = this.end - Date.now();

    if (farOutEnd > 0 && farOut < 0) {
      // if during maintenance
      this.action(null);
    } else if (farOut > 0) {
      // if before maintenance

      // wait time before the next action/warning
      let waitTime = farOut;

      // find rhe closest warning interval that time to maintenance `farOut` is still bigger than
      const closestInterval = WARNING_INTERVALS.map((interval) => interval * 60 * 1000).find((interval) => farOut > interval);

      if (closestInterval) {
        waitTime = farOut - closestInterval;
      }

      // don't spam them the moment they come in, they will recieve a warning in the next warning interval
      if (!first) {
        this.action(moment(this.start).fromNow(true));
      }

      this.timeout = setTimeout(() => this.maintenanceInterval(false), waitTime + 1000);
    }
  };

  // reference maintenance start/end time in UNIX timestamp
  evaluateMaintenance = (start, end) => {
    if (start !== this.start || end !== this.end) {
      this.start = start;
      this.end = end;
      clearTimeout(this.timeout);
      this.maintenanceInterval();
    }
  };
}

export default MaintenanceController;
