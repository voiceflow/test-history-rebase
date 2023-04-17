import * as APL from 'apl-viewhost-web';

class APLInitializer {
  private initialized = false;

  private initializePromise: Promise<void> | null = null;

  constructor() {
    // should subscribe before the APL loaded, otherwise initEngine promise will not be resolved
    this.initialize();
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      if (this.initializePromise === null) {
        this.initializePromise = APL.initEngine();
      }

      await this.initializePromise;

      this.initialized = true;
    } catch (err) {
      // to reinitialize next time
      this.initializePromise = null;

      throw err;
    }
  }
}

export default new APLInitializer();
