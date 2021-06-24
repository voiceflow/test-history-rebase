/* eslint-disable max-classes-per-file */
import { IS_IOS } from '@voiceflow/ui';

const SOUND_BANK_PREFIX = 'soundbank://soundlibrary/';
const SOUND_BANK_MIRROR = 'https://d3qhmae9zx9eb.cloudfront.net/';

export class TAudio extends Audio {
  public VF_REJECT?: Function;

  public VF_ON_PAUSE?: (audio: TAudio) => void;

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

  pause(): void {
    this.VF_ON_PAUSE?.(this);

    super.pause();
  }
}

class AudioController {
  public audio = new TAudio();

  /**
   * Pauses PrototypeMachine audio and replaces it with external audio before resuming again
   */
  public playExternal(src: string, muted = false): void {
    const externalAudio = new TAudio(src);
    externalAudio.muted = muted;
    const currentAudio = this.audio;

    if (!currentAudio.paused) {
      currentAudio.pause();

      const resume = () => {
        this.audio = currentAudio;
        this.audio.play();
      };

      externalAudio.onended = resume;
      externalAudio.onerror = resume;
    }

    this.audio = externalAudio;

    externalAudio.play();
  }

  public async play(
    src: undefined | null | string,
    {
      play = true,
      muted = false,
      loop = false,
      offset = 0,
      onError,
      onPause,
    }: { offset?: number; play?: boolean; muted?: boolean; loop?: boolean; onError?: () => void; onPause?: (audio: TAudio) => void } = {}
  ): Promise<void> {
    this.stop();

    return new Promise<void>((resolve, reject) => {
      if (!src) {
        return resolve();
      }

      this.audio.VF_REJECT = reject;
      this.audio.VF_ON_PAUSE = onPause;

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
  }

  public stop(): void {
    this.audio.pause();
    this.audio.VF_REJECT?.();

    this.audio.VF_REJECT = undefined;
    this.audio.VF_ON_PAUSE = undefined;

    this.audio.onended = null;
    this.audio.onerror = null;
    this.audio.loop = false;

    // do not recreate an audio on iOS, since the first message will not be played
    if (!IS_IOS) {
      this.audio = new TAudio();
    }
  }
}

export default AudioController;
