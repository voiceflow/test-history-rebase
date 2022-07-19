/* eslint-disable dot-notation, @typescript-eslint/ban-ts-comment */

import './utils/mockAudio';

import suite from '@/../test/_suite';
import AudioController, { TAudio } from '@/pages/Prototype/PrototypeTool/Audio';

suite('Prototype/PrototypeTool/Audio - TAudio', () => {
  describe('TAudio', () => {
    it('should be able to set src', async () => {
      const audio = new TAudio();

      audio.src = 'new src';

      expect(audio.src).toBe('new src');
    });

    it('should replace soundbank urls', () => {
      const audio = new TAudio();

      audio.src = 'soundbank://soundlibrary/ping';

      expect(audio.src).toBe('https://d3qhmae9zx9eb.cloudfront.net/ping.mp3');
    });

    it('should call VF_ON_PAUSE on pause', () => {
      // @ts-ignore
      const pause = vi.spyOn(TAudio.prototype, 'pause');

      const audio = new TAudio();
      const onPause = vi.fn();

      audio.pause();

      audio.VF_ON_PAUSE = onPause;

      audio.pause();

      expect(pause).toBeCalledTimes(2);
      expect(onPause).toBeCalledTimes(1);
      expect(onPause).toBeCalledWith(audio);
    });
  });
});

suite('Prototype/PrototypeTool/Audio', () => {
  beforeEach(() => {
    vi.spyOn(TAudio.prototype, 'play');
    vi.spyOn(TAudio.prototype, 'pause');
  });

  describe('play()', () => {
    it('should set src', () => {
      const controller = new AudioController();

      controller.play('src');

      expect(controller['audio'].src).toBe('src');
      expect(controller['audio'].play).toBeCalled();
    });

    it('should set loop and offset, onPause', () => {
      const controller = new AudioController();

      const onPause = vi.fn();

      controller.play('src', { loop: true, offset: 10, onPause });

      expect(controller['audio'].loop).toBeTruthy();
      expect(controller['audio'].VF_ON_PAUSE).toBe(onPause);
      expect(controller['audio'].currentTime).toBe(10);
    });

    it('should not call audio.play', () => {
      const controller = new AudioController();

      controller.play('src', { play: false });

      expect(controller['audio'].play).not.toBeCalled();
    });

    it('should be resolved on end', async () => {
      const controller = new AudioController();

      const promise = controller.play('src');

      setTimeout(controller['audio'].onended);

      await promise;
    });

    it('should not crash on error', async () => {
      const controller = new AudioController();

      const promise = controller.play('src');

      setTimeout(controller['audio'].onerror);

      await promise;
    });

    it('should be resolved on error', async () => {
      const controller = new AudioController();
      const onError = vi.fn();

      const promise = controller.play('src', { onError });

      setTimeout(controller['audio'].onerror);

      await promise;

      expect(onError).toBeCalledTimes(1);
    });

    it('should be rejected', async () => {
      const controller = new AudioController();

      try {
        const promise = controller.play('src');

        setTimeout(controller['audio'].VF_REJECT);

        await promise;

        throw new Error("Audio shouldn't be resolved");
      } catch {
        expect(true).toBeTruthy();
      }
    });
  });

  describe('stop()', () => {
    it('should call audio.pause', () => {
      const controller = new AudioController();

      controller.stop();

      expect(controller['audio'].pause).toBeCalled();
    });

    it('should call audio.VF_REJECT', () => {
      const controller = new AudioController();

      const reject = vi.fn();

      controller['audio'].VF_REJECT = reject;

      controller.stop();

      expect(reject).toBeCalled();
    });
  });

  describe('playExternal()', () => {
    it('should play audio', () => {
      const controller = new AudioController();

      controller.playExternal('src');

      expect(controller['audio'].play).toBeCalled();
    });

    it('should not pause current audio', () => {
      const controller = new AudioController();

      const currentAudio = controller['audio'];

      // @ts-ignore
      currentAudio.paused = true;

      controller.playExternal('src');

      expect(currentAudio.pause).not.toBeCalled();
      expect(currentAudio).not.toBe(controller['audio']);
    });

    it('should pause current audio', () => {
      const controller = new AudioController();

      const currentAudio = controller['audio'];

      // @ts-ignore
      currentAudio.paused = false;

      controller.playExternal('src');

      expect(currentAudio.pause).toBeCalled();
      expect(currentAudio).not.toBe(controller['audio']);
    });

    it('should continue current audio on end', () => {
      const controller = new AudioController();

      const currentAudio = controller['audio'];

      // @ts-ignore
      currentAudio.paused = false;

      controller.playExternal('src');

      expect(currentAudio).not.toBe(controller['audio']);

      // @ts-ignore
      controller['audio'].onended?.();

      expect(currentAudio).toBe(controller['audio']);
      expect(currentAudio.play).toBeCalled();
    });
  });
});
