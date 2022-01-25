/* eslint-disable dot-notation, @typescript-eslint/ban-ts-comment */

import { Node, Request } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { SinonSpy, SinonStub } from 'sinon';

import { createSuite } from '@/../test/_suite';
import { BlockType } from '@/constants';
import { SpeakTraceAudioType } from '@/constants/prototype';
import { Trace } from '@/models';
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
const STEP_ID = 'step-id';

const traceFactory = <T extends Node.Utils.TraceType>(type: T, payload: unknown): Trace => ({ id: ID, type, payload } as any);

enum TraceMethods {
  END = 'processEndTrace',
  FLOW = 'processFlowTrace',
  BLOCK = 'processBlockTrace',
  SPEAK = 'processSpeakTrace',
  CHOICE = 'processChoiceTrace',
  STREAM = 'processStreamTrace',
}

const suite = createSuite(({ spy, stub, expect }) => ({
  createController({ debug = false, context }: { debug?: boolean; context?: { trace: Trace[] } } = {}) {
    const engine = {
      node: { center: stub(), ports: { out: ['1'] } },
      nodes: [{ 1: { type: BlockType.START } }],
      select: stub(),
      selection: { replace: stub(), getTargets: stub(), reset: stub() },
      getNodeByID: stub().returns({ id: STEP_ID, parentNode: BLOCK_ID, combinedNodes: ['1'] }),
      prototype: { setFinalNodeID: stub() },
      finalPrototypeBlockID: stub().returns('123'),
    } as any as Engine;

    const audio = new AudioController();
    const timeout = new TimeoutController();
    const message = new MessageController({ props: { addToMessages: stub() } });

    stub(audio, 'play').returns(Promise.resolve());
    stub(audio, 'stop');
    stub(audio, 'playExternal');

    stub(timeout, 'delay').returns(Promise.resolve());
    stub(timeout, 'clearAll');

    const controller = new TraceController({
      props: {
        debug,
        getEngine: () => engine,
        setError: stub(),
        enterFlow: stub(),
        getNodeByID: stub(),
        fetchContext: stub().returns(context),
        updateStatus: stub(),
        setInteractions: stub(),
        flowIDHistory: [],
        activePathLinkIDs: [],
        activePathBlockIDs: [],
        getLinksByPortID: stub(),
        updatePrototype: stub(),
        contextStep: 1,
        activeDiagramID: '',
        isMuted: false,
        waitVisuals: true,
        contextHistory: [{}],
        visualDataHistory: [null],
        updatePrototypeVisualsData: stub(),
        updatePrototypeVisualsDataHistory: stub(),
      },
      audio,
      timeout,
      message: stub(message) as any as MessageController,
    });

    // @ts-ignore
    spy(controller, 'processTrace');

    stub(controller, 'waitNode' as any);
    stub(controller, 'waitDiagram' as any);
    stub(controller, 'waitEngineAndNodes' as any);

    // @ts-ignore
    Object.values(TraceMethods).forEach((method) => spy(controller, method));

    return controller;
  },

  emulateAudioError: (controller: TraceController) =>
    (controller['audio']['play'] as any as SinonStub).callsFake(async (_: any, { onError }: { onError: Function }) => onError()),

  emulateAudioPause: (controller: TraceController, audio: any) =>
    (controller['audio']['play'] as any as SinonStub).callsFake(async (_: any, { onPause }: { onPause: Function }) => onPause(audio)),

  emulateAudioReject: (controller: TraceController) => (controller['audio']['play'] as any as SinonStub).returns(Promise.reject()),

  emulateFetchContext(controller: TraceController, ...data: any[]) {
    let fetchContextDataCallCount = 0;

    return (controller['props']['fetchContext'] as any as SinonStub).callsFake(() => data[fetchContextDataCallCount++]);
  },

  expectSetTimeout: (controller: TraceController) => expect(controller['timeout']['delay']),

  expectAudioPlay: (controller: TraceController) => expect(controller['audio']['play']),

  expectAudioStop: (controller: TraceController) => expect(controller['audio']['stop']),

  expectAudioPlayExternal: (controller: TraceController) => expect(controller['audio']['playExternal']),

  expectMessage: <T extends Exclude<keyof MessageController, 'trackStartTime'>>(controller: TraceController, method: T, data: any) =>
    expect(controller['message'][method]).to.be.calledWith(data),

  expectUpdateStatus: (controller: TraceController) => expect(controller['props']['updateStatus']),

  expectSetError(controller: TraceController) {
    expect(controller['props']['updateStatus']).to.be.calledWith(PMStatus.ERROR);

    return expect(controller['props']['setError']);
  },

  expectSetInteractions: (controller: TraceController, interactions: { name: string; request?: Request.BaseRequest }[]) =>
    expect(controller['props']['setInteractions']).to.be.calledWith(interactions),

  expectEnterFlow: (controller: TraceController) => expect(controller['props']['enterFlow']),

  expectFocusNode: (controller: TraceController) => expect(controller['props']['getEngine']()!['node']['center']),

  expectProcessTrace: (controller: TraceController) => expect(controller['processTrace']),

  expectProcessSingleTrace(controller: TraceController, methodName?: TraceMethods, { onlyMessage = false }: { onlyMessage?: boolean } = {}) {
    Object.values(TraceMethods)
      .filter((method) => method !== methodName)
      .forEach((method) => {
        expect(controller[method], `${method} shouldn't be called for single ${methodName}`).not.to.be.called;
      });

    expect(controller['props']['updateStatus']).to.be.calledWith(PMStatus.NAVIGATING);
    expect(controller['props']['updateStatus']).to.be.calledWith(PMStatus.WAITING_USER_INTERACTION);
    expect((controller['processTrace'] as any as SinonSpy).args[1]).to.be.deep.eq([[], { onlyMessage }]);

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

        expectSetError(controller).to.be.calledWith('Unable to fetch response from custom endpoint: https://localhost:8005');
      });

      it('should not process trace', async () => {
        const controller = createController({ context: { trace: [] } });

        await controller.next();

        expectProcessTrace(controller).not.to.be.called;
      });

      it('should process block trace', async () => {
        const controller = createController({ context: { trace: [traceFactory(Node.Utils.TraceType.BLOCK, { blockID: BLOCK_ID })] } });

        await controller.next();

        expectFocusNode(controller).to.be.calledOnceWith(BLOCK_ID);
        expectProcessSingleTrace(controller, TraceMethods.BLOCK);
      });

      it('should process block without timeout', async () => {
        const controller = createController({ debug: true, context: { trace: [traceFactory(Node.Utils.TraceType.BLOCK, { blockID: BLOCK_ID })] } });

        await controller.next();

        expectFocusNode(controller).calledOnce;
        expectProcessSingleTrace(controller, TraceMethods.BLOCK);
      });

      it('should process speak(message) trace', async () => {
        const speakTrace = traceFactory(Node.Utils.TraceType.SPEAK, {
          src: SRC,
          type: SpeakTraceAudioType.MESSAGE,
          voice: 'voice',
          message: MESSAGE,
          choices: [],
        });

        const controller = createController({
          context: {
            trace: [speakTrace],
          },
        });

        await controller.next();

        expectMessage(controller, 'speak', speakTrace);
        expectProcessSingleTrace(controller, TraceMethods.SPEAK);
        expectAudioPlay(controller).to.be.calledWithMatch(SRC);
      });

      it('should process speak(audio) trace', async () => {
        const audioTrace = traceFactory(Node.Utils.TraceType.SPEAK, {
          src: SRC,
          type: SpeakTraceAudioType.AUDIO,
          message: MESSAGE,
          choices: [],
        });
        const controller = createController({
          context: {
            trace: [audioTrace],
          },
        });

        await controller.next();

        expectMessage(controller, 'speak', audioTrace);
        expectProcessSingleTrace(controller, TraceMethods.SPEAK);
        expectAudioPlay(controller).to.be.calledWithMatch(SRC);
      });

      it('should process speak trace audio error', async () => {
        const controller = createController({
          context: {
            trace: [
              traceFactory(Node.Utils.TraceType.SPEAK, {
                src: SRC,
                type: SpeakTraceAudioType.AUDIO,
                message: MESSAGE,
                choices: [],
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
              traceFactory(Node.Utils.TraceType.SPEAK, {
                src: SRC,
                type: SpeakTraceAudioType.AUDIO,
                message: MESSAGE,
                choices: [],
              }),
            ],
          },
        });

        emulateAudioReject(controller);

        await controller.next();
      });

      it('should process choice trace', async () => {
        const buttons = [{ name: 'name_1' }, { name: 'name_2' }, { name: 'name_3' }];

        const controller = createController({
          context: {
            trace: [traceFactory(Node.Utils.TraceType.CHOICE, { buttons })],
          },
        });

        await controller.next();

        expectProcessSingleTrace(controller, TraceMethods.CHOICE);
        expectSetInteractions(controller, buttons);
      });

      it('should process flow trace', async () => {
        const controller = createController({
          context: {
            trace: [traceFactory(Node.Utils.TraceType.FLOW, { diagramID: 'diagramID' })],
          },
        });

        await controller.next();

        expectProcessSingleTrace(controller, TraceMethods.FLOW);
        expectEnterFlow(controller).to.be.calledWith('diagramID');
        expect(controller['waitDiagram']).to.be.calledWithExactly('diagramID');
      });

      it('should process flow trace without diagramID', async () => {
        const controller = createController({
          context: {
            trace: [traceFactory(Node.Utils.TraceType.FLOW, {})],
          },
        });

        await controller.next();

        expectProcessSingleTrace(controller, TraceMethods.FLOW);
        expectEnterFlow(controller).not.to.be.called;
        expectSetTimeout(controller).not.to.be.called;
      });

      it('should process stream play', async () => {
        const controller = createController();

        const next = spy(controller, 'next');

        const streamTrace = traceFactory(Node.Utils.TraceType.STREAM, { src: SRC, action: Node.Stream.TraceStreamAction.PLAY, token: '1' });
        emulateFetchContext(controller, {
          trace: [streamTrace],
        });

        await controller.next();

        expect(controller['streamState']).to.be.deep.eq({ src: SRC, token: '1', offset: 0 });
        expectMessage(controller, 'stream', streamTrace);
        expectSetInteractions(controller, [
          { name: 'next', request: { type: 'text', payload: 'next' } },
          { name: 'previous', request: { type: 'text', payload: 'previous' } },
          { name: 'pause', request: { type: 'text', payload: 'pause' } },
        ]);
        expectUpdateStatus(controller).to.be.calledWith(PMStatus.WAITING_USER_INTERACTION);
        expectAudioPlay(controller).to.be.calledWithMatch(SRC);
        expect(next).to.be.calledWith({ type: Request.RequestType.TEXT, payload: Constants.IntentName.NEXT });
        expectProcessSingleTrace(controller, TraceMethods.STREAM);
      });

      it('should process stream pause', async () => {
        const controller = createController();

        const streamTrace = traceFactory(Node.Utils.TraceType.STREAM, { src: SRC, action: Node.Stream.TraceStreamAction.PAUSE, token: '1' });
        emulateFetchContext(controller, {
          trace: [streamTrace],
        });

        const next = spy(controller, 'next');

        await controller.next();

        expectMessage(controller, 'stream', streamTrace);
        expectSetInteractions(controller, [
          { name: 'next', request: { type: 'text', payload: 'next' } },
          { name: 'previous', request: { type: 'text', payload: 'previous' } },
          { name: 'resume', request: { type: 'text', payload: 'resume' } },
        ]);
        expectUpdateStatus(controller).to.be.calledWith(PMStatus.WAITING_USER_INTERACTION);
        expectAudioStop(controller).to.be.calledTwice;
        expectAudioPlay(controller).not.to.be.calledWithMatch(SRC);
        expect(next).not.to.be.calledWith({ type: Request.RequestType.TEXT, payload: Constants.IntentName.NEXT });
        expectProcessSingleTrace(controller, TraceMethods.STREAM);
      });

      it('should process stream audio pause', async () => {
        const controller = createController();

        emulateFetchContext(controller, {
          trace: [traceFactory(Node.Utils.TraceType.STREAM, { src: SRC, action: Node.Stream.TraceStreamAction.PLAY, token: '1' })],
        });

        emulateAudioPause(controller, { currentTime: 10 });

        await controller.next();

        expect(controller['streamState']['offset']).to.be.eq(10);
      });

      it('should process stream audio error', async () => {
        const controller = createController();

        emulateFetchContext(controller, {
          trace: [traceFactory(Node.Utils.TraceType.STREAM, { src: SRC, action: Node.Stream.TraceStreamAction.PLAY, token: '1' })],
        });
        emulateAudioError(controller);

        await controller.next();

        expectUpdateStatus(controller).to.be.calledWith(PMStatus.ERROR);
        expectSetError(controller).to.be.calledWith('Unable to play an audio');
      });

      it('should process stream audio reject', async () => {
        const controller = createController();

        const next = spy(controller, 'next');

        emulateFetchContext(controller, {
          trace: [traceFactory(Node.Utils.TraceType.STREAM, { src: SRC, action: Node.Stream.TraceStreamAction.PLAY, token: '1' })],
        });
        emulateAudioReject(controller);

        await controller.next();

        expect(next).not.to.be.calledWith({ type: Request.RequestType.TEXT, payload: Constants.IntentName.NEXT });
      });

      it('should process debug trace', async () => {
        const debugTrace = traceFactory(Node.Utils.TraceType.DEBUG, { message: MESSAGE });
        const controller = createController({
          context: { trace: [debugTrace] },
        });

        await controller.next();

        expectMessage(controller, 'debug', debugTrace);
        expectProcessSingleTrace(controller);
      });

      it('should process end trace', async () => {
        const controller = createController({
          context: { trace: [traceFactory(Node.Utils.TraceType.END, {})] },
        });

        await controller.next();

        expectUpdateStatus(controller).to.be.calledWith(PMStatus.ENDED);
      });

      it('should crash on unsupported trace', async () => {
        const controller = createController({
          context: { trace: [{} as any] },
        });

        await controller.next();
      });

      it('should process all traces', async () => {
        const controller = createController();

        emulateFetchContext(
          controller,
          {
            trace: [
              traceFactory(Node.Utils.TraceType.BLOCK, { blockID: BLOCK_ID }),
              traceFactory(Node.Utils.TraceType.SPEAK, {
                src: SRC,
                type: SpeakTraceAudioType.MESSAGE,
                voice: 'voice',
                message: MESSAGE,
                choices: [],
              }),
              traceFactory(Node.Utils.TraceType.STREAM, { src: SRC, action: Node.Stream.TraceStreamAction.PLAY, token: '1' }),
            ],
          },
          {
            trace: [
              traceFactory(Node.Utils.TraceType.CHOICE, { choices: [{ name: 'name_1' }, { name: 'name_2' }, { name: 'name_3' }] }),
              traceFactory(Node.Utils.TraceType.FLOW, { diagramID: 'diagramID' }),
              traceFactory(Node.Utils.TraceType.END, {}),
            ],
          }
        );

        await controller.next();

        Object.values(TraceMethods).forEach((method) => expect(controller[method]).to.be.called);
        expectUpdateStatus(controller).to.be.calledWith(PMStatus.ENDED);
      });

      it('should not process traces if stopped', async () => {
        const controller = createController({
          context: { trace: [traceFactory(Node.Utils.TraceType.BLOCK, { blockID: BLOCK_ID })] },
        });

        controller['stopped'] = true;

        await controller.next();

        expectUpdateStatus(controller).not.to.be.calledWith(PMStatus.NAVIGATING);
      });
    });

    describe('stop()', () => {
      it('should clear and stop  trace', () => {
        const controller = createController();

        controller['trace'] = [traceFactory(Node.Utils.TraceType.BLOCK, { blockID: BLOCK_ID })];

        controller.stop();

        expect(controller['trace']).to.be.deep.eq([]);
        expect(controller['stopped']).to.true;
      });
    });

    describe('flushTrace()', () => {
      it('should only log messages', async () => {
        const controller = createController();

        const speakTrace = traceFactory(Node.Utils.TraceType.SPEAK, {
          src: SRC,
          type: SpeakTraceAudioType.MESSAGE,
          voice: 'voice',
          message: MESSAGE,
          choices: [],
        });

        const audioTrace = traceFactory(Node.Utils.TraceType.STREAM, { src: SRC, action: Node.Stream.TraceStreamAction.PLAY, token: '1' });

        controller['trace'] = [
          traceFactory(Node.Utils.TraceType.BLOCK, { blockID: BLOCK_ID }),
          speakTrace,
          audioTrace,
          traceFactory(Node.Utils.TraceType.CHOICE, { choices: [{ name: 'name_1' }, { name: 'name_2' }, { name: 'name_3' }] }),
          traceFactory(Node.Utils.TraceType.FLOW, { diagramID: 'diagramID' }),
          traceFactory(Node.Utils.TraceType.END, {}),
        ];

        await controller.flushTrace();

        expectMessage(controller, 'speak', speakTrace);
        expectMessage(controller, 'stream', audioTrace);
        expectAudioPlay(controller).not.to.be.called;
      });
    });
  }
);
