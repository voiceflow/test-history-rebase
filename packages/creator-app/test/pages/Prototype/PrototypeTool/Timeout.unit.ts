/* eslint-disable dot-notation */

import suite from '@/../test/_suite';
import TimeoutController from '@/pages/Prototype/PrototypeTool/Timeout';

suite('Prototype/PrototypeTool/Timeout', ({ spy, expect }) => {
  describe('delay()', () => {
    it('should delay timeouts', () => {
      const controller = new TimeoutController();

      controller.delay(0);
      controller.delay(900);

      expect(controller['timeouts'].length).to.be.eq(2);
    });

    it('should resolved async', async () => {
      const controller = new TimeoutController();

      let counter = 0;

      const promise = controller.delay(10).then(() => expect(counter).to.be.eq(1));

      expect(counter).to.be.eq(0);

      counter += 1;

      await promise;
    });
  });

  describe('clearAll()', () => {
    it('should delay timeouts', () => {
      const controller = new TimeoutController();

      controller.delay(0);
      controller.delay(900);

      const clearTimeout = spy(global, 'clearTimeout');

      controller.clearAll();

      expect(clearTimeout).to.be.calledTwice;
      expect(controller['timeouts'].length).to.be.eq(0);
    });
  });
});
