class TimeoutController {
  // eslint-disable-next-line compat/compat
  private timeouts: Map<number, number> = new Map<number, number>();

  public async set(timeout: number) {
    return new Promise((resolve) => {
      const timeoutID = setTimeout(() => {
        this.timeouts.delete(timeoutID);

        resolve();
      }, timeout);

      this.timeouts.set(timeoutID, timeoutID);
    });
  }

  public clearAll() {
    this.timeouts.forEach((timeoutID) => clearTimeout(timeoutID));
    this.timeouts.clear();
  }
}

export default TimeoutController;
