/* eslint-disable dot-notation */

import suite from '@/../test/_suite';
import TimeoutController from '@/pages/Prototype/PrototypeTool/Timeout';

suite('Prototype/PrototypeTool/Timeout', () => {
  describe('delay()', () => {
    it('should delay timeouts', () => {
      const controller = new TimeoutController();

      controller.delay(0);
      controller.delay(900);

      expect(controller['timeouts'].length).toBe(2);
    });

    it('should resolved async', async () => {
      const controller = new TimeoutController();

      let counter = 0;

      const promise = controller.delay(10).then(() => expect(counter).toBe(1));

      expect(counter).toBe(0);

      counter += 1;

      await promise;
    });
  });

  describe('clearAll()', () => {
    it('should delay timeouts', () => {
      const controller = new TimeoutController();

      controller.delay(0);
      controller.delay(900);

      const clearTimeout = vi.spyOn(global, 'clearTimeout');

      controller.clearAll();

      expect(clearTimeout).toBeCalledTimes(2);
      expect(controller['timeouts'].length).toBe(0);
    });
  });
});
