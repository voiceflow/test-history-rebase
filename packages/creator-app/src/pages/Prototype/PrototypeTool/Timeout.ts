import { Utils } from '@voiceflow/common';

class TimeoutController {
  private timeouts: NodeJS.Timeout[] = [];

  public async set(timeout: number) {
    return new Promise<void>((resolve) => {
      const timeoutID = setTimeout(() => {
        this.timeouts = Utils.array.withoutValue(this.timeouts, timeoutID);

        resolve();
      }, timeout);

      this.timeouts = Utils.array.append(this.timeouts, timeoutID);
    });
  }

  public clearAll() {
    this.timeouts.forEach((timeoutID) => clearTimeout(timeoutID));
    this.timeouts = [];
  }
}

export default TimeoutController;
