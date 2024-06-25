/* eslint-disable max-classes-per-file */

const SOUND_BANK_PREFIX = 'soundbank://soundlibrary/';
const SOUND_BANK_MIRROR = 'https://d3qhmae9zx9eb.cloudfront.net/';

export class TAudio extends Audio {
  // eslint-disable-next-line @typescript-eslint/ban-types
  public VF_REJECT?: Function;

  public VF_ON_STOP?: (audio: TAudio) => void;

  set src(value: string) {
    if (value.startsWith(SOUND_BANK_PREFIX)) {
      super.src = `${value.replace(SOUND_BANK_PREFIX, SOUND_BANK_MIRROR)}.mp3`;
    } else {
      super.src = value;
    }
  }

  get src(): string {
    return super.src;
  }

  stop(): void {
    this.VF_ON_STOP?.(this);

    super.pause();
  }
}

class AudioController {
  private resolveCurrentAudio?: VoidFunction;

  public audio: TAudio;

  constructor() {
    this.audio = new TAudio();
  }

  public pause(): void {
    this.audio.pause();
  }

  public continue(): void {
    this.audio.play();
  }

  public mute(): void {
    this.audio.muted = true;
    this.resolveCurrentAudio?.();
  }

  public async play(
    src: undefined | null | string,
    {
      play = true,
      muted = false,
      loop = false,
      offset = 0,
      onStop,
      onError,
    }: {
      offset?: number;
      play?: boolean;
      muted?: boolean;
      loop?: boolean;
      onError?: () => void;
      onStop?: (audio: TAudio) => void;
    } = {}
  ): Promise<void> {
    this.stop();

    if (!src) return Promise.resolve();

    const promise = new Promise<void>((resolve, reject) => {
      this.resolveCurrentAudio = resolve;
      this.audio.VF_REJECT = reject;
      this.audio.VF_ON_STOP = onStop;

      this.audio.onended = () => resolve();
      this.audio.muted = muted;
      this.audio.onerror = () => {
        onError?.();

        resolve();
      };

      this.audio.src = src;

      this.audio.loop = loop;
      this.audio.currentTime = offset;

      if (play) {
        this.audio.play();
      }
    });

    const result = await promise;
    this.resolveCurrentAudio = undefined;

    return result;
  }

  public stop(): void {
    this.audio.stop?.();
    this.audio.VF_REJECT?.();

    this.audio.VF_REJECT = undefined;
    this.audio.VF_ON_STOP = undefined;

    this.audio.loop = false;
    this.audio.onended = null;
    this.audio.onerror = null;
    this.audio.currentTime = 0;
  }
}

export default AudioController;
