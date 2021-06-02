import { append, withoutValue } from '@/utils/array';

class TimeoutController {
  private timeouts: NodeJS.Timeout[] = [];

  public async set(timeout: number) {
    return new Promise<void>((resolve) => {
      const timeoutID = setTimeout(() => {
        this.timeouts = withoutValue(this.timeouts, timeoutID);

        resolve();
      }, timeout);

      this.timeouts = append(this.timeouts, timeoutID);
    });
  }

  public clearAll() {
    this.timeouts.forEach((timeoutID) => clearTimeout(timeoutID));
    this.timeouts = [];
  }
}

export default TimeoutController;
