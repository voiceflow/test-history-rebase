/* eslint-disable dot-notation, @typescript-eslint/ban-ts-comment */

import type { BaseTrace } from '@voiceflow/base-types';
import { BaseNode } from '@voiceflow/base-types';

import { createSuite } from '@/../test/_suite';
import MessageController from '@/pages/Prototype/PrototypeTool/Message';
import { MessageType } from '@/pages/Prototype/types';

const suite = createSuite(() => ({
  describeMessage(method: keyof MessageController, type: MessageType, args: any, dataToCheck?: any) {
    describe(`${method}()`, () => {
      it(`${method} - should call .add with correct message`, () => {
        const controller = new MessageController({ props: { addToMessages: vi.fn() } });

        vi.setSystemTime(1000);

        controller.trackStartTime();
        vi.setSystemTime(11000);

        // @ts-ignore
        const add = vi.spyOn(controller, 'add');

        const id = `${Date.now()}`;

        controller[method]({ id, ...args });

        expect(add).toBeCalledTimes(1);
        expect(add).toBeCalledWith({ id, type, ...dataToCheck, startTime: '00:10' });
      });
    });
  },
}));

suite('Prototype/PrototypeTool/Message', ({ describeMessage }) => {
  describe('add()', () => {
    it('add - should call .addToMessages with correct message', () => {
      const controller = new MessageController({ props: { addToMessages: vi.fn() } });

      // @ts-ignore
      controller['add']({ a: 10, b: 20 });

      expect(controller['props']['addToMessages']).toBeCalledTimes(1);
      expect(controller['props']['addToMessages']).toBeCalledWith({ a: 10, b: 20 });
    });
  });

  const sessionTrace = { message: 'message' };
  describeMessage('session', MessageType.SESSION, sessionTrace, { message: 'message' });

  const streamTrace: BaseTrace.StreamTrace = {
    type: BaseNode.Utils.TraceType.STREAM,
    payload: { src: 'audio', token: 'asdf', action: BaseNode.Stream.TraceStreamAction.PLAY },
  };
  describeMessage('stream', MessageType.STREAM, streamTrace, { audio: 'audio' });

  const speakTrace: BaseTrace.SpeakTrace = {
    type: BaseNode.Utils.TraceType.SPEAK,
    payload: { src: 'src', voice: 'voice', message: 'message', type: BaseNode.Speak.TraceSpeakType.MESSAGE },
  };
  describeMessage('speak', MessageType.SPEAK, speakTrace, { message: 'message', voice: 'voice', src: 'src' });

  const audioTrace: BaseTrace.SpeakTrace = {
    type: BaseNode.Utils.TraceType.SPEAK,
    payload: { src: 'src', message: 'message', type: BaseNode.Speak.TraceSpeakType.AUDIO },
  };
  describeMessage('speak', MessageType.AUDIO, audioTrace, { name: 'message', src: 'src' });

  const debugTrace: BaseTrace.DebugTrace = {
    type: BaseNode.Utils.TraceType.DEBUG,
    payload: { message: 'message' },
  };
  describeMessage('debug', MessageType.DEBUG, debugTrace, { message: 'message' });

  describeMessage('user', MessageType.USER, { input: 'input' }, { input: 'input' });
});
