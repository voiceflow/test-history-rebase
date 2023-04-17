import { Utils } from '@voiceflow/common';

class TimeoutController {
  private timeouts: number[] = [];

  private delayResolves = new Map<number, VoidFunction>();

  public set(timeout: number, callback: VoidFunction): number {
    const timeoutID = setTimeout(() => {
      this.timeouts = Utils.array.withoutValue(this.timeouts, timeoutID);

      callback();
    }, timeout) as any;

    this.timeouts = Utils.array.append(this.timeouts, timeoutID);

    return timeoutID as any;
  }

  public delay(timeout: number): Promise<void> & { timeoutID: number } {
    let timeoutID!: number;

    const promise = new Promise<void>((resolve) => {
      const timeoutResolve = () => {
        this.delayResolves.delete(timeoutID);
        resolve();
      };

      timeoutID = this.set(timeout, timeoutResolve);

      this.delayResolves.set(timeoutID, timeoutResolve);
    });

    return Object.assign(promise, { timeoutID });
  }

  public clearByID(timeoutID: number): void {
    clearTimeout(timeoutID);

    this.timeouts = Utils.array.withoutValue(this.timeouts, timeoutID);

    this.delayResolves.get(timeoutID)?.();
  }

  public clearAll(): void {
    this.timeouts.forEach((timeoutID) => {
      clearTimeout(timeoutID);
      this.delayResolves.get(timeoutID)?.();
    });

    this.timeouts = [];
  }
}

export default TimeoutController;
