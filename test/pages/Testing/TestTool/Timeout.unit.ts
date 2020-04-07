/* eslint-disable dot-notation, @typescript-eslint/ban-ts-ignore */

import './utils/mockAudio';

import suite from '@/../test/_suite';
import TimeoutController from '@/pages/TestingV2/TestTool/Timeout';

suite('TestingV2/TestTool/Timeout', ({ spy, expect }) => {
  describe('set()', () => {
    it('should set timeouts', () => {
      const controller = new TimeoutController();

      controller.set(0);
      controller.set(900);

      expect(controller['timeouts'].size).to.be.eq(2);
    });

    it('should resolved async', async () => {
      const controller = new TimeoutController();

      let counter = 0;

      const promise = controller.set(10).then(() => expect(counter).to.be.eq(1));

      expect(counter).to.be.eq(0);

      counter += 1;

      await promise;
    });
  });

  describe('clearAll()', () => {
    it('should set timeouts', () => {
      const controller = new TimeoutController();

      controller.set(0);
      controller.set(900);

      const clearTimeout = spy(global, 'clearTimeout');

      controller.clearAll();

      expect(clearTimeout).to.be.calledTwice;
      expect(controller['timeouts'].size).to.be.eq(0);
    });
  });
});
