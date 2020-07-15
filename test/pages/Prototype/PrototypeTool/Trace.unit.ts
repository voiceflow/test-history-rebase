/* eslint-disable dot-notation, @typescript-eslint/ban-ts-comment */

import './utils/mockAudio';

import NLC from '@voiceflow/natural-language-commander';
import { IIntent } from '@voiceflow/natural-language-commander/dist/lib/nlcInterfaces';
import { SinonSpy, SinonStub } from 'sinon';

import { createSuite } from '@/../test/_suite';
import { SpeakTraceAudioType, StreamTraceAction, Trace, TraceMap, TraceType } from '@/ducks/prototype';
import type { Engine } from '@/pages/Canvas/engine';
import AudioController from '@/pages/Prototype/PrototypeTool/Audio';
import MessageController from '@/pages/Prototype/PrototypeTool/Message';
import TimeoutController from '@/pages/Prototype/PrototypeTool/Timeout';
import TraceController from '@/pages/Prototype/PrototypeTool/Trace';
import { PMStatus } from '@/pages/Prototype/types';

const ID = 'id';
const SRC = 'src';
const MESSAGE = 'message';
const BLOCK_ID = 'block-id';

const traceFactory = <T extends TraceType>(type: T, payload: TraceMap[T]['payload']): Trace => ({ id: ID, type, payload } as TraceMap[T]);

enum TraceMethods {
  END = 'processEndTrace',
  FLOW = 'processFlowTrace',
  BLOCK = 'processBlockTrace',
  SPEAK = 'processSpeakTrace',
  CHOICE = 'processChoiceTrace',
  STREAM = 'processStreamTrace',
}

const suite = createSuite(({ spy, stub, mock, expect }) => ({
  createController({
    debug = false,
    intents = [],
    context,
  }: { debug?: boolean; intents?: Omit<IIntent, 'callback'>[]; context?: { trace: Trace[] } } = {}) {
    const nlc = ({ getIntents: mock().returns(intents) } as any) as NLC;
    const engine = ({ node: { center: mock() }, selection: { replace: mock() } } as any) as Engine;

    const audio = new AudioController();
    const timeout = new TimeoutController();
    const message = new MessageController({ props: { addToMessages: stub() } });

    stub(audio, 'play').returns(Promise.resolve());
    stub(audio, 'stop');
    stub(audio, 'playExternal');

    stub(timeout, 'set').returns(Promise.resolve());
    stub(timeout, 'clearAll');

    const controller = new TraceController({
      props: {
        nlc,
        debug,
        engine,
        setError: stub(),
        enterFlow: stub(),
        fetchContext: stub().returns(context),
        updateStatus: stub(),
        setInteractions: stub(),
      },
      audio,
      timeout,
      message: (stub(message) as any) as MessageController,
    });

    // @ts-ignore
    spy(controller, 'processTrace');

    // @ts-ignore
    Object.values(TraceMethods).forEach((method) => spy(controller, method));

    return controller;
  },

  emulateAudioError(controller: TraceController) {
    return ((controller['audio']['play'] as any) as SinonStub).callsFake(async (_: any, { onError }: { onError: Function }) => onError());
  },

  emulateAudioPause(controller: TraceController, audio: any) {
    return ((controller['audio']['play'] as any) as SinonStub).callsFake(async (_: any, { onPause }: { onPause: Function }) => onPause(audio));
  },

  emulateAudioReject(controller: TraceController) {
    return ((controller['audio']['play'] as any) as SinonStub).returns(Promise.reject());
  },

  emulateFetchContext(controller: TraceController, ...data: any[]) {
    let fetchContextDataCallCount = 0;

    return ((controller['props']['fetchContext'] as any) as SinonStub).callsFake(() => data[fetchContextDataCallCount++]);
  },

  expectSetTimeout(controller: TraceController) {
    return expect(controller['timeout']['set']);
  },

  expectAudioPlay(controller: TraceController) {
    return expect(controller['audio']['play']);
  },

  expectAudioStop(controller: TraceController) {
    return expect(controller['audio']['stop']);
  },

  expectAudioPlayExternal(controller: TraceController) {
    return expect(controller['audio']['playExternal']);
  },

  expectMessage<T extends Exclude<keyof MessageController, 'trackStartTime'>>(
    controller: TraceController,
    method: T,
    ...data: Parameters<MessageController[T]>
  ) {
    return expect(controller['message'][method]).to.be.calledWith(...data);
  },

  expectUpdateStatus(controller: TraceController) {
    return expect(controller['props']['updateStatus']);
  },

  expectSetError(controller: TraceController) {
    expect(controller['props']['updateStatus']).to.be.calledWith(PMStatus.ERROR);

    return expect(controller['props']['setError']);
  },

  expectSetInteractions(controller: TraceController, interactions: { name: string }[]) {
    return expect(controller['props']['setInteractions']).to.be.calledWith(interactions);
  },

  expectEnterFlow(controller: TraceController) {
    return expect(controller['props']['enterFlow']);
  },

  expectFocusNode(controller: TraceController, nodeID: string) {
    expect(controller['props']['engine']!['selection']['replace']).to.be.calledWith([nodeID]);
    return expect(controller['props']['engine']!['node']['center']);
  },

  expectProcessTrace(controller: TraceController) {
    return expect(controller['processTrace']);
  },

  expectProcessSingleTrace(controller: TraceController, methodName?: TraceMethods, { onlyMessage = false }: { onlyMessage?: boolean } = {}) {
    Object.values(TraceMethods)
      .filter((method) => method !== methodName)
      .forEach((method) => {
        expect(controller[method], `${method} shouldn't be called for single ${methodName}`).not.to.be.called;
      });

    expect(controller['props']['updateStatus']).to.be.calledWith(PMStatus.NAVIGATING);
    expect(controller['props']['updateStatus']).to.be.calledWith(PMStatus.WAITING_USER_INTERACTION);
    expect(((controller['processTrace'] as any) as SinonSpy).args[1]).to.be.deep.eq([[], { onlyMessage }]);

    return expect(controller['processTrace']).to.be.calledTwice;
  },
}));

suite(
  'Prototype/PrototypeTool/Trace',
  ({
    spy,
    expect,
    expectMessage,
    expectSetError,
    expectAudioStop,
    expectEnterFlow,
    expectFocusNode,
    expectAudioPlay,
    expectSetTimeout,
    createController,
    emulateAudioError,
    emulateAudioPause,
    expectProcessTrace,
    expectUpdateStatus,
    emulateAudioReject,
    emulateFetchContext,
    expectSetInteractions,
    expectProcessSingleTrace,
  }) => {
    describe('next()', () => {
      it('should change the status', async () => {
        const controller = createController();

        await controller.next();

        expectUpdateStatus(controller).to.be.calledWith(PMStatus.FETCHING_CONTEXT);
      });

      it('should set error', async () => {
        const controller = createController();

        await controller.next();

        expectSetError(controller).to.be.calledWith('Unable to fetch response');
      });

      it('should not process trace', async () => {
        const controller = createController({ context: { trace: [] } });

        await controller.next();

        expectProcessTrace(controller).not.to.be.called;
      });

      it('should process block trace', async () => {
        const controller = createController({ context: { trace: [traceFactory(TraceType.BLOCK, { blockID: BLOCK_ID })] } });

        await controller.next();

        expectFocusNode(controller, BLOCK_ID).to.be.calledOnceWith(BLOCK_ID);
        expectSetTimeout(controller).not.to.be.called;
        expectProcessSingleTrace(controller, TraceMethods.BLOCK);
      });

      it('should process block without timeout', async () => {
        const controller = createController({ debug: true, context: { trace: [traceFactory(TraceType.BLOCK, { blockID: BLOCK_ID })] } });

        await controller.next();

        expectFocusNode(controller, BLOCK_ID).calledOnce;
        expectSetTimeout(controller).to.be.called;
        expectProcessSingleTrace(controller, TraceMethods.BLOCK);
      });

      it('should process speak(message) trace', async () => {
        const controller = createController({
          context: {
            trace: [
              traceFactory(TraceType.SPEAK, {
                src: SRC,
                type: SpeakTraceAudioType.MESSAGE,
                voice: 'voice',
                message: MESSAGE,
              }),
            ],
          },
        });

        await controller.next();

        expectMessage(controller, 'speak', ID, { src: SRC, voice: 'voice', message: MESSAGE });
        expectProcessSingleTrace(controller, TraceMethods.SPEAK);
        expectAudioPlay(controller).to.be.calledWithMatch(SRC);
      });

      it('should process speak(audio) trace', async () => {
        const controller = createController({
          context: {
            trace: [
              traceFactory(TraceType.SPEAK, {
                src: SRC,
                type: SpeakTraceAudioType.AUDIO,
                message: MESSAGE,
              }),
            ],
          },
        });

        await controller.next();

        expectMessage(controller, 'audio', ID, { src: SRC, name: MESSAGE });
        expectProcessSingleTrace(controller, TraceMethods.SPEAK);
        expectAudioPlay(controller).to.be.calledWithMatch(SRC);
      });

      it('should process speak trace audio error', async () => {
        const controller = createController({
          context: {
            trace: [
              traceFactory(TraceType.SPEAK, {
                src: SRC,
                type: SpeakTraceAudioType.AUDIO,
                message: MESSAGE,
              }),
            ],
          },
        });

        emulateAudioError(controller);

        await controller.next();

        expectUpdateStatus(controller).to.be.calledWith(PMStatus.ERROR);
        expectSetError(controller).to.be.calledWith('Unable to play an audio');
      });

      it('should process speak trace audio reject', async () => {
        const controller = createController({
          context: {
            trace: [
              traceFactory(TraceType.SPEAK, {
                src: SRC,
                type: SpeakTraceAudioType.AUDIO,
                message: MESSAGE,
              }),
            ],
          },
        });

        emulateAudioReject(controller);

        await controller.next();
      });

      it('should process choice trace', async () => {
        const controller = createController({
          intents: [
            { intent: 'name_1', utterances: ['name 1'] },
            { intent: 'name_3', utterances: ['name 3'] },
          ],
          context: {
            trace: [
              traceFactory(TraceType.CHOICE, {
                choices: [{ name: 'name_1' }, { name: 'name_2' }, { name: 'name_3' }],
              }),
            ],
          },
        });

        await controller.next();

        expectProcessSingleTrace(controller, TraceMethods.CHOICE);
        expectSetInteractions(controller, [{ name: 'name 1' }, { name: 'name_2' }, { name: 'name 3' }]);
      });

      it('should process flow trace', async () => {
        const controller = createController({
          context: {
            trace: [traceFactory(TraceType.FLOW, { diagramID: 'diagramID' })],
          },
        });

        await controller.next();

        expectProcessSingleTrace(controller, TraceMethods.FLOW);
        expectEnterFlow(controller).to.be.calledWith('diagramID');
        expectSetTimeout(controller).to.be.called;
      });

      it('should process flow trace without diagramID', async () => {
        const controller = createController({
          context: {
            trace: [traceFactory(TraceType.FLOW, {})],
          },
        });

        await controller.next();

        expectProcessSingleTrace(controller, TraceMethods.FLOW);
        expectEnterFlow(controller).not.to.be.called;
        expectSetTimeout(controller).not.to.be.called;
      });

      it('should process stream play', async () => {
        const controller = createController();

        const getNextStateRequest = spy(TraceController, 'getNextStateRequest');

        emulateFetchContext(controller, { trace: [traceFactory(TraceType.STREAM, { src: SRC, action: StreamTraceAction.PLAY, token: '1' })] });

        await controller.next();

        expect(controller['streamState']).to.be.deep.eq({ src: SRC, token: '1', offset: 0 });
        expectMessage(controller, 'stream', ID, { audio: SRC });
        expectSetInteractions(controller, [{ name: 'next' }, { name: 'previous' }, { name: 'pause' }]);
        expectUpdateStatus(controller).to.be.calledWith(PMStatus.WAITING_USER_INTERACTION);
        expectAudioPlay(controller).to.be.calledWithMatch(SRC);
        expect(getNextStateRequest).to.be.calledWith({ intent: 'AMAZON.NextIntent' });
        expectProcessSingleTrace(controller, TraceMethods.STREAM);
      });

      it('should process stream pause', async () => {
        const controller = createController();

        emulateFetchContext(controller, { trace: [traceFactory(TraceType.STREAM, { src: SRC, action: StreamTraceAction.PAUSE, token: '1' })] });

        const getNextStateRequest = spy(TraceController, 'getNextStateRequest');

        await controller.next();

        expectMessage(controller, 'stream', ID, { audio: SRC });
        expectSetInteractions(controller, [{ name: 'next' }, { name: 'previous' }, { name: 'resume' }]);
        expectUpdateStatus(controller).to.be.calledWith(PMStatus.WAITING_USER_INTERACTION);
        expectAudioStop(controller).to.be.calledTwice;
        expectAudioPlay(controller).not.to.be.calledWithMatch(SRC);
        expect(getNextStateRequest).not.to.be.calledWith({ intent: 'AMAZON.NextIntent' });
        expectProcessSingleTrace(controller, TraceMethods.STREAM);
      });

      it('should process stream audio pause', async () => {
        const controller = createController();

        emulateFetchContext(controller, { trace: [traceFactory(TraceType.STREAM, { src: SRC, action: StreamTraceAction.PLAY, token: '1' })] });

        emulateAudioPause(controller, { currentTime: 10 });

        await controller.next();

        expect(controller['streamState']['offset']).to.be.eq(10);
      });

      it('should process stream audio error', async () => {
        const controller = createController();

        emulateFetchContext(controller, { trace: [traceFactory(TraceType.STREAM, { src: SRC, action: StreamTraceAction.PLAY, token: '1' })] });
        emulateAudioError(controller);

        await controller.next();

        expectUpdateStatus(controller).to.be.calledWith(PMStatus.ERROR);
        expectSetError(controller).to.be.calledWith('Unable to play an audio');
      });

      it('should process stream audio reject', async () => {
        const controller = createController();

        const getNextStateRequest = spy(TraceController, 'getNextStateRequest');

        emulateFetchContext(controller, { trace: [traceFactory(TraceType.STREAM, { src: SRC, action: StreamTraceAction.PLAY, token: '1' })] });
        emulateAudioReject(controller);

        await controller.next();

        expect(getNextStateRequest).not.to.be.calledWith({ intent: 'AMAZON.NextIntent' });
      });

      it('should process debug trace', async () => {
        const controller = createController({
          context: { trace: [traceFactory(TraceType.DEBUG, { message: MESSAGE })] },
        });

        await controller.next();

        expectMessage(controller, 'debug', ID, { message: MESSAGE });
        expectProcessSingleTrace(controller);
      });

      it('should process end trace', async () => {
        const controller = createController({
          context: { trace: [traceFactory(TraceType.END, {})] },
        });

        const stop = spy(controller, 'stop');

        await controller.next();

        expect(stop).to.be.called;
        expectMessage(controller, 'session', ID, 'Session Ended');
        expectUpdateStatus(controller).to.be.calledWith(PMStatus.ENDED);
      });

      it('should crash on unsupported trace', async () => {
        const controller = createController({
          context: { trace: [{} as any] },
        });

        await controller.next();
      });

      it('should process all traces', async () => {
        const controller = createController({
          intents: [
            { intent: 'name_1', utterances: ['name 1'] },
            { intent: 'name_3', utterances: ['name 3'] },
          ],
        });

        emulateFetchContext(
          controller,
          {
            trace: [
              traceFactory(TraceType.BLOCK, { blockID: BLOCK_ID }),
              traceFactory(TraceType.SPEAK, {
                src: SRC,
                type: SpeakTraceAudioType.MESSAGE,
                voice: 'voice',
                message: MESSAGE,
              }),
              traceFactory(TraceType.STREAM, { src: SRC, action: StreamTraceAction.PLAY, token: '1' }),
            ],
          },
          {
            trace: [
              traceFactory(TraceType.CHOICE, { choices: [{ name: 'name_1' }, { name: 'name_2' }, { name: 'name_3' }] }),
              traceFactory(TraceType.FLOW, { diagramID: 'diagramID' }),
              traceFactory(TraceType.END, {}),
            ],
          }
        );

        const stop = spy(controller, 'stop');

        await controller.next();

        expect(stop).to.be.called;
        Object.values(TraceMethods).forEach((method) => expect(controller[method]).to.be.called);
        expectMessage(controller, 'session', ID, 'Session Ended');
        expectUpdateStatus(controller).to.be.calledWith(PMStatus.ENDED);
      });

      it('should not process traces if stopped', async () => {
        const controller = createController({
          context: { trace: [traceFactory(TraceType.BLOCK, { blockID: BLOCK_ID })] },
        });

        controller['stopped'] = true;

        await controller.next();

        expectUpdateStatus(controller).not.to.be.calledWith(PMStatus.NAVIGATING);
      });
    });

    describe('stop()', () => {
      it('should clear and stop  trace', async () => {
        const controller = createController();

        controller['trace'] = [traceFactory(TraceType.BLOCK, { blockID: BLOCK_ID })];

        await controller.stop();

        expect(controller['trace']).to.be.deep.eq([]);
        expect(controller['stopped']).to.true;
      });
    });

    describe('emptyTrace()', () => {
      it('should only log messages', async () => {
        const controller = createController({
          intents: [
            { intent: 'name_1', utterances: ['name 1'] },
            { intent: 'name_3', utterances: ['name 3'] },
          ],
        });

        controller['trace'] = [
          traceFactory(TraceType.BLOCK, { blockID: BLOCK_ID }),
          traceFactory(TraceType.SPEAK, {
            src: SRC,
            type: SpeakTraceAudioType.MESSAGE,
            voice: 'voice',
            message: MESSAGE,
          }),
          traceFactory(TraceType.STREAM, { src: SRC, action: StreamTraceAction.PLAY, token: '1' }),
          traceFactory(TraceType.CHOICE, { choices: [{ name: 'name_1' }, { name: 'name_2' }, { name: 'name_3' }] }),
          traceFactory(TraceType.FLOW, { diagramID: 'diagramID' }),
          traceFactory(TraceType.END, {}),
        ];

        await controller.emptyTrace();

        expectMessage(controller, 'speak', ID, { src: SRC, voice: 'voice', message: MESSAGE });
        expectMessage(controller, 'stream', ID, { audio: SRC });
        expectMessage(controller, 'session', ID, 'Session Ended');
        expectAudioPlay(controller).not.to.be.called;
      });
    });
  }
);
