/* eslint-disable dot-notation, @typescript-eslint/ban-ts-ignore */

import './utils/mockAudio';

import { createSuite } from '@/../test/_suite';
import MessageController from '@/pages/TestingV2/TestTool/Message';
import { MessageType } from '@/pages/TestingV2/types';

const suite = createSuite(({ spy, mock, expect }) => ({
  describeMessage(method: keyof MessageController, type: MessageType, args: any, dataToCheck?: any) {
    describe(`${method}()`, () => {
      it(`${method} - should call .add with correct message`, () => {
        const controller = new MessageController({ props: { addToMessages: mock() } });

        // @ts-ignore
        const add = spy(controller, 'add');

        const id = `${Date.now()}`;

        controller[method](id, args);

        expect(add).to.be.calledOnceWith({ id, type, ...(dataToCheck ?? args) });
      });
    });
  },
}));

suite('TestingV2/TestTool/Message', ({ stub, mock, expect, describeMessage }) => {
  describe('add()', () => {
    it('add - should call .addToMessages with correct message', () => {
      const controller = new MessageController({ props: { addToMessages: mock() } });

      const now = stub(Date, 'now').returns(1000);

      controller.trackStartTime();

      now.returns(11000);

      // @ts-ignore
      controller['add']({ a: 10, b: 20 });

      expect(controller['props']['addToMessages']).to.be.calledOnceWith({ a: 10, b: 20, startTime: '00:10' });
    });
  });

  describeMessage('session', MessageType.SESSION, 'message', { message: 'message' });

  describeMessage('stream', MessageType.STREAM, { audio: 'audio' });

  describeMessage('speak', MessageType.SPEAK, { message: 'message', voice: 'voice', src: 'src' });

  describeMessage('audio', MessageType.AUDIO, { name: 'name', src: 'src' });

  describeMessage('debug', MessageType.DEBUG, { message: 'message' });

  describeMessage('user', MessageType.USER, 'input', { input: 'input' });
});
