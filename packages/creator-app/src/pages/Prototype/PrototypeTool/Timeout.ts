import { Utils } from '@voiceflow/common';

class TimeoutController {
  private timeouts: number[] = [];

  public set(timeout: number, callback: VoidFunction): number {
    const timeoutID = setTimeout(() => {
      this.timeouts = Utils.array.withoutValue(this.timeouts, timeoutID);

      callback();
    }, timeout) as any;

    this.timeouts = Utils.array.append(this.timeouts, timeoutID);

    return timeoutID as any;
  }

  public async delay(timeout: number): Promise<void> {
    return new Promise<void>((resolve) => {
      this.set(timeout, resolve);
    });
  }

  public clearByID(timeoutID: number): void {
    clearTimeout(timeoutID);

    this.timeouts = Utils.array.withoutValue(this.timeouts, timeoutID);
  }

  public clearAll(): void {
    this.timeouts.forEach((timeoutID) => clearTimeout(timeoutID));
    this.timeouts = [];
  }
}

export default TimeoutController;
