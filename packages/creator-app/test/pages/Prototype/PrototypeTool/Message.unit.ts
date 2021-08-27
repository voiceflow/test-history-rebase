/* eslint-disable dot-notation, @typescript-eslint/ban-ts-comment */

import { Node, Trace } from '@voiceflow/base-types';

import { createSuite } from '@/../test/_suite';
import MessageController from '@/pages/Prototype/PrototypeTool/Message';
import { MessageType } from '@/pages/Prototype/types';

const suite = createSuite(({ spy, mock, expect, stub }) => ({
  describeMessage(method: keyof MessageController, type: MessageType, args: any, dataToCheck?: any) {
    describe(`${method}()`, () => {
      it(`${method} - should call .add with correct message`, () => {
        const controller = new MessageController({ props: { addToMessages: mock() } });

        const now = stub(Date, 'now').returns(1000);
        controller.trackStartTime();
        now.returns(11000);
        // @ts-ignore
        const add = spy(controller, 'add');

        const id = `${Date.now()}`;

        controller[method]({ id, ...args });

        expect(add).to.be.calledOnceWith({ id, type, ...dataToCheck, startTime: '00:10' });
      });
    });
  },
}));

suite('Prototype/PrototypeTool/Message', ({ mock, expect, describeMessage }) => {
  describe('add()', () => {
    it('add - should call .addToMessages with correct message', () => {
      const controller = new MessageController({ props: { addToMessages: mock() } });

      // @ts-ignore
      controller['add']({ a: 10, b: 20 });

      expect(controller['props']['addToMessages']).to.be.calledOnceWith({ a: 10, b: 20 });
    });
  });

  const sessionTrace = { message: 'message' };
  describeMessage('session', MessageType.SESSION, sessionTrace, { message: 'message' });

  const streamTrace: Trace.StreamTrace = {
    type: Node.Utils.TraceType.STREAM,
    payload: { src: 'audio', token: 'asdf', action: Node.Stream.TraceStreamAction.PLAY },
  };
  describeMessage('stream', MessageType.STREAM, streamTrace, { audio: 'audio' });

  const speakTrace: Trace.SpeakTrace = {
    type: Node.Utils.TraceType.SPEAK,
    payload: { src: 'src', voice: 'voice', message: 'message', type: Node.Speak.TraceSpeakType.MESSAGE },
  };
  describeMessage('speak', MessageType.SPEAK, speakTrace, { message: 'message', voice: 'voice', src: 'src' });

  const audioTrace: Trace.SpeakTrace = {
    type: Node.Utils.TraceType.SPEAK,
    payload: { src: 'src', message: 'message', type: Node.Speak.TraceSpeakType.AUDIO },
  };
  describeMessage('speak', MessageType.AUDIO, audioTrace, { name: 'message', src: 'src' });

  const debugTrace: Trace.DebugTrace = {
    type: Node.Utils.TraceType.DEBUG,
    payload: { message: 'message' },
  };
  describeMessage('debug', MessageType.DEBUG, debugTrace, { message: 'message' });

  describeMessage('user', MessageType.USER, { input: 'input' }, { input: 'input' });
});
