/* eslint-disable dot-notation, @typescript-eslint/ban-ts-comment */

import './utils/mockAudio';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import AudioController, { TAudio } from './Audio';

describe('Prototype/PrototypeTool/Audio - TAudio', () => {
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

    it('should call VF_ON_STOP on stop', () => {
      // @ts-ignore
      const stop = vi.spyOn(TAudio.prototype, 'stop');

      const audio = new TAudio();
      const onStop = vi.fn();

      audio.stop();

      audio.VF_ON_STOP = onStop;

      audio.stop();

      expect(stop).toBeCalledTimes(2);
      expect(onStop).toBeCalledTimes(1);
      expect(onStop).toBeCalledWith(audio);
    });
  });
});

describe('Prototype/PrototypeTool/Audio', () => {
  beforeEach(() => {
    vi.spyOn(TAudio.prototype, 'play');
    vi.spyOn(TAudio.prototype, 'stop');
  });

  describe('play()', () => {
    it('should set src', () => {
      const controller = new AudioController();

      controller.play('src');

      expect(controller['audio'].src).toBe('src');
      expect(controller['audio'].play).toBeCalled();
    });

    it('should set loop and offset, onStop', () => {
      const controller = new AudioController();

      const onStop = vi.fn();

      controller.play('src', { loop: true, offset: 10, onStop });

      expect(controller['audio'].loop).toBeTruthy();
      expect(controller['audio'].VF_ON_STOP).toBe(onStop);
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

      setTimeout(controller['audio'].onended!);

      await promise;
    });

    it('should not crash on error', async () => {
      const controller = new AudioController();

      const promise = controller.play('src');

      setTimeout(controller['audio'].onerror!);

      await promise;
    });

    it('should be resolved on error', async () => {
      const controller = new AudioController();
      const onError = vi.fn();

      const promise = controller.play('src', { onError });

      setTimeout(controller['audio'].onerror!);

      await promise;

      expect(onError).toBeCalledTimes(1);
    });

    it('should be rejected', async () => {
      const controller = new AudioController();

      try {
        const promise = controller.play('src');

        setTimeout(controller['audio'].VF_REJECT!);

        await promise;

        throw new Error("Audio shouldn't be resolved");
      } catch {
        expect(true).toBeTruthy();
      }
    });
  });

  describe('stop()', () => {
    it('should call audio.stop', () => {
      const controller = new AudioController();

      controller.stop();

      expect(controller['audio'].stop).toBeCalled();
    });

    it('should call audio.VF_REJECT', () => {
      const controller = new AudioController();

      const reject = vi.fn();

      controller['audio'].VF_REJECT = reject;

      controller.stop();

      expect(reject).toBeCalled();
    });
  });
});
