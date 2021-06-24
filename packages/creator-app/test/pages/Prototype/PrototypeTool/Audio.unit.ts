/* eslint-disable dot-notation, @typescript-eslint/ban-ts-comment */

import suite from '@/../test/_suite';
import AudioController, { TAudio } from '@/pages/Prototype/PrototypeTool/Audio';
import { noop } from '@/utils/functional';

suite('Prototype/PrototypeTool/Audio - TAudio', ({ spy, stub, expect }) => {
  describe('TAudio', () => {
    it('should be able to set src', async () => {
      const audio = new TAudio();

      audio.src = 'new src';

      expect(audio.src).to.be.eq('new src');
    });

    it('should replace soundbank urls', () => {
      const audio = new TAudio();

      audio.src = 'soundbank://soundlibrary/ping';

      expect(audio.src).to.be.eq('https://d3qhmae9zx9eb.cloudfront.net/ping.mp3');
    });

    it('should call VF_ON_PAUSE on pause', () => {
      // @ts-ignore
      const pause = spy(TAudio.prototype, 'pause');

      const audio = new TAudio();
      const onPause = stub();

      audio.pause();

      audio.VF_ON_PAUSE = onPause;

      audio.pause();

      expect(pause).to.be.calledTwice;
      expect(onPause).to.be.calledOnceWith(audio);
    });
  });
});

suite('Prototype/PrototypeTool/Audio', ({ stub, expect }) => {
  beforeEach(() => {
    stub(TAudio.prototype, 'play');
    stub(TAudio.prototype, 'pause');
  });

  describe('play()', () => {
    it('should set src', () => {
      const controller = new AudioController();

      controller.play('src');

      expect(controller['audio'].src).to.be.eq('src');
      expect(controller['audio'].play).to.be.called;
    });

    it('should set loop and offset, onPause', () => {
      const controller = new AudioController();

      const onPause = stub();

      controller.play('src', { loop: true, offset: 10, onPause });

      expect(controller['audio'].loop).to.be.true;
      expect(controller['audio'].VF_ON_PAUSE).to.be.eq(onPause);
      expect(controller['audio'].currentTime).to.be.eq(10);
    });

    it('should not call audio.play', () => {
      const controller = new AudioController();

      controller.play('src', { play: false });

      expect(controller['audio'].play).not.to.be.called;
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
      const onError = stub();

      const promise = controller.play('src', { onError });

      setTimeout(controller['audio'].onerror);

      await promise;

      expect(onError).to.be.calledOnce;
    });

    it('should be rejected', async () => {
      const controller = new AudioController();

      try {
        const promise = controller.play('src');

        setTimeout(controller['audio'].VF_REJECT);

        await promise;

        throw new Error("Audio shouldn't be resolved");
      } catch {
        expect(true).to.be.true;
      }
    });
  });

  describe('stop()', () => {
    it('should call audio.pause', () => {
      const controller = new AudioController();

      controller.stop();

      expect(controller['audio'].pause).to.be.called;
    });

    it('should call audio.VF_REJECT', () => {
      const controller = new AudioController();

      const reject = stub();

      controller['audio'].VF_REJECT = reject;

      controller.stop();

      expect(reject).to.be.called;
    });

    it('should clear audio', () => {
      const controller = new AudioController();

      controller.play('src').catch(noop);

      controller.stop();

      expect(controller['audio'].VF_REJECT).not.to.be;
      expect(controller['audio'].VF_ON_PAUSE).not.to.be;
      expect(controller['audio'].onended).not.to.be;
      expect(controller['audio'].onerror).not.to.be;
      expect(controller['audio'].loop).not.to.be;
    });
  });

  describe('playExternal()', () => {
    it('should play audio', () => {
      const controller = new AudioController();

      controller.playExternal('src');

      expect(controller['audio'].play).to.be.called;
    });

    it('should not pause current audio', () => {
      const controller = new AudioController();

      const currentAudio = controller['audio'];

      // @ts-ignore
      currentAudio.paused = true;

      controller.playExternal('src');

      expect(currentAudio.pause).not.to.be.called;
      expect(currentAudio).not.to.be.eq(controller['audio']);
    });

    it('should pause current audio', () => {
      const controller = new AudioController();

      const currentAudio = controller['audio'];

      // @ts-ignore
      currentAudio.paused = false;

      controller.playExternal('src');

      expect(currentAudio.pause).to.be.called;
      expect(currentAudio).not.to.be.eq(controller['audio']);
    });

    it('should continue current audio on end', () => {
      const controller = new AudioController();

      const currentAudio = controller['audio'];

      // @ts-ignore
      currentAudio.paused = false;

      controller.playExternal('src');

      expect(currentAudio).not.to.be.eq(controller['audio']);

      // @ts-ignore
      controller['audio'].onended?.();

      expect(currentAudio).to.be.eq(controller['audio']);
      expect(currentAudio.play).to.be.called;
    });
  });
});
