import logger from './logger';

interface SpeedResult {
  bPs: number;
  kBPs: number;
  mBPs: number;

  readableBPs: string;
  readableKBPs: string;
  readableMBPs: string;

  connectionType: string;
  connectionEffectiveType: string;
}

class SpeedDetection {
  private logger = logger.child('SpeedDetection');

  private results: SpeedResult | null = null;

  private imageURL = '/speedmap.jpeg';

  private downloadSize = 1093957;

  private pendingPromise: Promise<SpeedResult> | null = null;

  async detect(): Promise<SpeedResult> {
    logger.debug('Checking connection...');

    return this.measureConnectionSpeed();
  }

  getResults(): SpeedResult | null {
    return this.results;
  }

  private measureConnectionSpeed = () => {
    if (this.pendingPromise) return this.pendingPromise;

    this.pendingPromise = new Promise<SpeedResult>((resolve, reject) => {
      const startTime = new Date().getTime();

      const download = new Image();

      download.onload = () => {
        const endTime = new Date().getTime();

        const duration = (endTime - startTime) / 1000;
        const bitsLoaded = this.downloadSize * 8;

        const bPs = bitsLoaded / duration;
        const kBPs = bPs / 1024;
        const mBPs = bPs / 1024;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const connectionType = window.navigator?.connection?.type ?? 'unknown';

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const connectionEffectiveType = window.navigator?.connection?.effectiveType ?? 'unknown';

        this.pendingPromise = null;

        this.logger.debug('Connection speed: %s Mbps, Type: %s, Effective Type: %s', [
          mBPs.toFixed(2),
          connectionType,
          connectionEffectiveType,
        ]);

        resolve({
          bPs,
          kBPs,
          mBPs,

          readableBPs: bPs.toFixed(2),
          readableKBPs: kBPs.toFixed(2),
          readableMBPs: mBPs.toFixed(2),

          connectionType,
          connectionEffectiveType,
        });
      };

      download.onerror = () => {
        this.pendingPromise = null;

        this.logger.debug("Couldn't measure connection speed");

        reject();
      };

      download.src = `${this.imageURL}?time=${startTime}`;
    });

    return this.pendingPromise;
  };
}

export default new SpeedDetection();
