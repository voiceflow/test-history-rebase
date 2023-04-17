import dayjs from 'dayjs';

// evaluates maintenance intervals and calls a given action callback at appropriate interavals
class MaintenanceController {
  start = -1;

  end = -1;

  timeout: NodeJS.Timeout | null = null;

  intervals: number[];

  constructor(private action: (timeout: string | null) => void, intervals: number[]) {
    this.intervals = intervals.map((interval) => interval * 60 * 1000);
  }

  maintenanceInterval = () => {
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

      // find the closest warning interval that time to maintenance `farOut` is still bigger than
      const closestInterval = this.intervals.find((interval) => farOut > interval);

      if (closestInterval) {
        waitTime = farOut - closestInterval;
      }

      // only show pop up warning if within intervals
      if (closestInterval! < this.intervals[0]) {
        this.action(dayjs(this.start).fromNow(true));
      }

      this.timeout = setTimeout(() => this.maintenanceInterval(), waitTime + 1000);
    }
  };

  // reference maintenance start/end time in UNIX timestamp
  evaluateMaintenance = (start: number, end: number) => {
    if (start !== this.start || end !== this.end) {
      this.start = start;
      this.end = end;
      clearTimeout(this.timeout!);
      this.maintenanceInterval();
    }
  };
}

export default MaintenanceController;
