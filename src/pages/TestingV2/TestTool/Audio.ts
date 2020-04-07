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

  pause() {
    this.VF_ON_PAUSE?.(this);

    super.pause();
  }
}

class AudioController {
  private audio = new TAudio();

  /**
   * Pauses TestingMachine audio and replaces it with external audio before resuming again
   */
  public playExternal(src: string) {
    const externalAudio = new TAudio(src);

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
    src: string,
    {
      play = true,
      loop = false,
      offset = 0,
      onError,
      onPause,
    }: { offset?: number; play?: boolean; loop?: boolean; onError?: () => void; onPause?: (audio: TAudio) => void } = {}
  ) {
    this.stop();

    return new Promise((resolve, reject) => {
      this.audio.VF_REJECT = reject;
      this.audio.VF_ON_PAUSE = onPause;

      this.audio.onended = resolve;

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

  public stop() {
    this.audio.pause();
    this.audio.VF_REJECT?.();

    this.audio.VF_REJECT = undefined;
    this.audio.VF_ON_PAUSE = undefined;

    this.audio.onended = null;
    this.audio.onerror = null;
    this.audio.loop = false;

    this.audio = new TAudio();
  }
}

export default AudioController;
