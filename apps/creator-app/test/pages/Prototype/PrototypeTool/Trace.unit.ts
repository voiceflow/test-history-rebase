/* eslint-disable dot-notation, @typescript-eslint/ban-ts-comment */

import './utils/mockAudio';

import { BaseNode, BaseRequest } from '@voiceflow/base-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { SpyInstance } from 'vitest';

import { createSuite } from '@/../test/_suite';
import { BlockType } from '@/constants';
import { SpeakTraceAudioType } from '@/constants/prototype';
import { Trace } from '@/models';
import type Engine from '@/pages/Canvas/engine';
import AudioController from '@/pages/Prototype/PrototypeTool/Audio';
import MessageController from '@/pages/Prototype/PrototypeTool/Message';
import TimeoutController from '@/pages/Prototype/PrototypeTool/Timeout';
import TraceController from '@/pages/Prototype/PrototypeTool/Trace';
import { PMStatus } from '@/pages/Prototype/types';
import logger from '@/utils/logger';

const ID = 'id';
const SRC = 'src';
const MESSAGE = 'message';
const BLOCK_ID = 'block-id';
const STEP_ID = 'step-id';

const traceFactory = <T extends BaseNode.Utils.TraceType>(type: T, payload: unknown): Trace => ({ id: ID, type, payload } as any);

enum TraceMethods {
  END = 'processEndTrace',
  FLOW = 'processFlowTrace',
  BLOCK = 'processBlockTrace',
  SPEAK = 'processSpeakTrace',
  CHOICE = 'processChoiceTrace',
  STREAM = 'processStreamTrace',
}

const suite = createSuite(() => ({
  createController({ debug = false, context }: { debug?: boolean; context?: { trace: Trace[] } } = {}) {
    const engine = {
      node: { center: vi.fn(), ports: { out: ['1'] } },
      nodes: [{ 1: { type: BlockType.START } }],
      select: vi.fn().mockReturnValue(() => {}),
      selection: { replace: vi.fn(), getTargets: vi.fn(), reset: vi.fn() },
      getNodeByID: vi.fn().mockReturnValue({ id: STEP_ID, parentNode: BLOCK_ID, combinedNodes: ['1'] }),
      getStepIDsByBlockID: vi.fn().mockReturnValue(['1']),
      getNodeIDByStepID: vi.fn().mockReturnValue(BLOCK_ID),
      prototype: { setFinalNodeID: vi.fn(), subscribe: vi.fn(), reset: vi.fn() },
      isSynced: () => true,
      finalPrototypeBlockID: vi.fn().mockReturnValue('123'),
    } as any as Engine;

    const audio = new AudioController();
    const timeout = new TimeoutController();
    const message = new MessageController({ props: { addToMessages: vi.fn() } });

    vi.spyOn(audio, 'play').mockReturnValue(Promise.resolve());
    vi.spyOn(audio, 'stop');
    vi.spyOn(audio, 'pause');
    vi.spyOn(audio, 'continue');

    vi.spyOn(timeout, 'delay').mockReturnValue(Promise.resolve());
    vi.spyOn(timeout, 'clearAll');

    vi.spyOn(message, 'session');
    vi.spyOn(message, 'stream');
    vi.spyOn(message, 'speak');
    vi.spyOn(message, 'debug');
    vi.spyOn(message, 'text');
    vi.spyOn(message, 'visual');
    vi.spyOn(message, 'carousel');
    vi.spyOn(message, 'user');

    const controller = new TraceController({
      props: {
        debug,
        getEngine: () => engine,
        enterDiagram: vi.fn(),
        fetchContext: vi.fn().mockReturnValue(context),
        updateStatus: vi.fn(),
        setInteractions: vi.fn(),
        flowIDHistory: [],
        activePaths: {},
        getLinksByPortID: vi.fn(),
        updatePrototype: vi.fn(),
        contextStep: 1,
        activeDiagramID: 'diagramID',
        isMuted: false,
        waitVisuals: true,
        contextHistory: [{}],
        visualDataHistory: [null],
        updatePrototypeVisualsData: vi.fn(),
        updatePrototypeVisualsDataHistory: vi.fn(),
        setError: vi.fn(),
      },
      audio,
      timeout,
      logger,
      message,
    });

    vi.spyOn(controller, 'processTrace' as any);
    vi.spyOn(controller, 'waitNode' as any);
    vi.spyOn(controller, 'waitDiagram' as any);
    vi.spyOn(controller, 'waitEngineAndNodes' as any);

    // @ts-ignore
    Object.values(TraceMethods).forEach((method) => vi.spyOn(controller, method));

    return controller;
  },

  emulateAudioError: (controller: TraceController) =>
    (controller['audio']['play'] as any as SpyInstance).mockImplementation(async (_: any, { onError }: { onError: Function }) => onError()),

  emulateAudioPause: (controller: TraceController, audio: any) =>
    (controller['audio']['play'] as any as SpyInstance).mockImplementation(async (_: any, { onStop }: { onStop: Function }) => onStop(audio)),

  emulateAudioReject: (controller: TraceController) => (controller['audio']['play'] as any as SpyInstance).mockReturnValue(Promise.reject()),

  emulateFetchContext(controller: TraceController, ...data: any[]) {
    let fetchContextDataCallCount = 0;

    return (controller['props']['fetchContext'] as any as SpyInstance).mockImplementation(() => data[fetchContextDataCallCount++]);
  },

  expectSetTimeout: (controller: TraceController) => expect(controller['timeout']['delay']),

  expectAudioPlay: (controller: TraceController) => expect(controller['audio']['play']),

  expectAudioStop: (controller: TraceController) => expect(controller['audio']['stop']),

  expectMessage: <T extends Exclude<keyof MessageController, 'trackStartTime'>>(controller: TraceController, method: T, data: any) =>
    expect(controller['message'][method]).toBeCalledWith(data),

  expectUpdateStatus: (controller: TraceController) => expect(controller['props']['updateStatus']),

  expectSetError(controller: TraceController) {
    expect(controller['props']['updateStatus']).toBeCalledWith(PMStatus.ERROR);

    return expect(controller['props']['setError']);
  },

  expectSetInteractions: (controller: TraceController, interactions: { name: string; request?: BaseRequest.BaseRequest }[]) =>
    expect(controller['props']['setInteractions']).toBeCalledWith(interactions),

  expectEnterFlow: (controller: TraceController) => expect(controller['props']['enterDiagram']),

  expectFocusNode: (controller: TraceController) => expect(controller['props']['getEngine']()!['node']['center']),

  expectProcessTrace: (controller: TraceController) => expect(controller['processTrace']),

  expectProcessSingleTrace(controller: TraceController, methodName?: TraceMethods, { onlyMessage = false }: { onlyMessage?: boolean } = {}) {
    Object.values(TraceMethods)
      .filter((method) => method !== methodName)
      .forEach((method) => {
        expect(controller[method]).not.toBeCalled();
      });

    expect(controller['props']['updateStatus']).toBeCalledWith(PMStatus.NAVIGATING);
    expect(controller['props']['updateStatus']).toBeCalledWith(PMStatus.WAITING_USER_INTERACTION);
    expect((controller['processTrace'] as any as SpyInstance).mock.calls[1]).toEqual([[], { onlyMessage }]);

    return expect(controller['processTrace']).toBeCalledTimes(2);
  },
}));

suite(
  'Prototype/PrototypeTool/Trace',
  ({
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

        expectUpdateStatus(controller).toBeCalledWith(PMStatus.FETCHING_CONTEXT);
      });

      it('should set error', async () => {
        const controller = createController();

        await controller.next();

        expectSetError(controller).toBeCalledWith('Unable to fetch response');
      });

      it('should not process trace', async () => {
        const controller = createController({ context: { trace: [] } });

        await controller.next();

        expectProcessTrace(controller).not.toBeCalled();
      });

      it('should process block trace', async () => {
        const controller = createController({ context: { trace: [traceFactory(BaseNode.Utils.TraceType.BLOCK, { blockID: BLOCK_ID })] } });

        await controller.next();

        expectFocusNode(controller).toBeCalledTimes(1);
        expectFocusNode(controller).toBeCalledWith(BLOCK_ID);
        expectProcessSingleTrace(controller, TraceMethods.BLOCK);
      });

      it('should process block without timeout', async () => {
        const controller = createController({
          debug: true,
          context: { trace: [traceFactory(BaseNode.Utils.TraceType.BLOCK, { blockID: BLOCK_ID })] },
        });

        await controller.next();

        expectFocusNode(controller).toBeCalledTimes(1);
        expectProcessSingleTrace(controller, TraceMethods.BLOCK);
      });

      it('should process speak(message) trace', async () => {
        const speakTrace = traceFactory(BaseNode.Utils.TraceType.SPEAK, {
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
        expectAudioPlay(controller).toBeCalledWith(SRC, expect.objectContaining({}));
      });

      it('should process speak(audio) trace', async () => {
        const audioTrace = traceFactory(BaseNode.Utils.TraceType.SPEAK, {
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
        expectAudioPlay(controller).toBeCalledWith(SRC, expect.objectContaining({}));
      });

      it('should process speak trace audio error', async () => {
        const controller = createController({
          context: {
            trace: [
              traceFactory(BaseNode.Utils.TraceType.SPEAK, {
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

        expectUpdateStatus(controller).toBeCalledWith(PMStatus.ERROR);
        expectSetError(controller).toBeCalledWith('Unable to play an audio');
      });

      it('should process speak trace audio reject', async () => {
        const controller = createController({
          context: {
            trace: [
              traceFactory(BaseNode.Utils.TraceType.SPEAK, {
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
            trace: [traceFactory(BaseNode.Utils.TraceType.CHOICE, { buttons })],
          },
        });

        await controller.next();

        expectProcessSingleTrace(controller, TraceMethods.CHOICE);
        expectSetInteractions(controller, buttons);
      });

      it('should process flow trace', async () => {
        const controller = createController({
          context: {
            trace: [traceFactory(BaseNode.Utils.TraceType.FLOW, { diagramID: 'diagramID' })],
          },
        });

        await controller.next();

        expectProcessSingleTrace(controller, TraceMethods.FLOW);
        expectEnterFlow(controller).toBeCalledWith('diagramID');
        expect(controller['waitDiagram']).toBeCalledWith('diagramID');
        expect(controller['props']['getEngine']()!['prototype']['subscribe']).toBeCalled();
      });

      it('should process flow trace without diagramID', async () => {
        const controller = createController({
          context: {
            trace: [traceFactory(BaseNode.Utils.TraceType.FLOW, {})],
          },
        });

        await controller.next();

        expectProcessSingleTrace(controller, TraceMethods.FLOW);
        expectEnterFlow(controller).not.toBeCalled();
        expectSetTimeout(controller).not.toBeCalled();
      });

      it('should process stream play', async () => {
        const controller = createController();

        const next = vi.spyOn(controller, 'next');

        const streamTrace = traceFactory(BaseNode.Utils.TraceType.STREAM, { src: SRC, action: BaseNode.Stream.TraceStreamAction.PLAY, token: '1' });
        emulateFetchContext(controller, {
          trace: [streamTrace],
        });

        await controller.next();

        expect(controller['streamState']).toEqual({ src: SRC, token: '1', offset: 0 });
        expectMessage(controller, 'stream', streamTrace);
        expectSetInteractions(controller, [
          { name: 'next', request: { type: 'text', payload: 'next' } },
          { name: 'previous', request: { type: 'text', payload: 'previous' } },
          { name: 'pause', request: { type: 'text', payload: 'pause' } },
        ]);
        expectUpdateStatus(controller).toBeCalledWith(PMStatus.WAITING_USER_INTERACTION);
        expectAudioPlay(controller).toBeCalledWith(SRC, expect.objectContaining({}));
        expect(next).toBeCalledWith({ type: BaseRequest.RequestType.TEXT, payload: VoiceflowConstants.IntentName.NEXT });
        expectProcessSingleTrace(controller, TraceMethods.STREAM);
      });

      it('should process stream pause', async () => {
        const controller = createController();

        const streamTrace = traceFactory(BaseNode.Utils.TraceType.STREAM, { src: SRC, action: BaseNode.Stream.TraceStreamAction.PAUSE, token: '1' });
        emulateFetchContext(controller, {
          trace: [streamTrace],
        });

        const next = vi.spyOn(controller, 'next');

        await controller.next();

        expectMessage(controller, 'stream', streamTrace);
        expectSetInteractions(controller, [
          { name: 'next', request: { type: 'text', payload: 'next' } },
          { name: 'previous', request: { type: 'text', payload: 'previous' } },
          { name: 'resume', request: { type: 'text', payload: 'resume' } },
        ]);
        expectUpdateStatus(controller).toBeCalledWith(PMStatus.WAITING_USER_INTERACTION);
        expectAudioStop(controller).toBeCalledTimes(2);
        expectAudioPlay(controller).not.toBeCalledWith(SRC, expect.objectContaining({}));
        expect(next).not.toBeCalledWith({ type: BaseRequest.RequestType.TEXT, payload: VoiceflowConstants.IntentName.NEXT });
        expectProcessSingleTrace(controller, TraceMethods.STREAM);
      });

      it('should process stream audio pause', async () => {
        const controller = createController();

        emulateFetchContext(controller, {
          trace: [traceFactory(BaseNode.Utils.TraceType.STREAM, { src: SRC, action: BaseNode.Stream.TraceStreamAction.PLAY, token: '1' })],
        });

        emulateAudioPause(controller, { currentTime: 10 });

        await controller.next();

        expect(controller['streamState']['offset']).toEqual(10);
      });

      it('should process stream audio error', async () => {
        const controller = createController();

        emulateFetchContext(controller, {
          trace: [traceFactory(BaseNode.Utils.TraceType.STREAM, { src: SRC, action: BaseNode.Stream.TraceStreamAction.PLAY, token: '1' })],
        });
        emulateAudioError(controller);

        await controller.next();

        expectUpdateStatus(controller).toBeCalledWith(PMStatus.ERROR);
        expectSetError(controller).toBeCalledWith('Unable to play an audio');
      });

      it('should process stream audio reject', async () => {
        const controller = createController();

        const next = vi.spyOn(controller, 'next');

        emulateFetchContext(controller, {
          trace: [traceFactory(BaseNode.Utils.TraceType.STREAM, { src: SRC, action: BaseNode.Stream.TraceStreamAction.PLAY, token: '1' })],
        });
        emulateAudioReject(controller);

        await controller.next();

        expect(next).not.toBeCalledWith({ type: BaseRequest.RequestType.TEXT, payload: VoiceflowConstants.IntentName.NEXT });
      });

      it('should process debug trace', async () => {
        const debugTrace = traceFactory(BaseNode.Utils.TraceType.DEBUG, { message: MESSAGE });
        const controller = createController({
          context: { trace: [debugTrace] },
        });

        await controller.next();

        expectMessage(controller, 'debug', debugTrace);
        expectProcessSingleTrace(controller);
      });

      it('should process end trace', async () => {
        const controller = createController({
          context: { trace: [traceFactory(BaseNode.Utils.TraceType.END, {})] },
        });

        await controller.next();

        expectUpdateStatus(controller).toBeCalledWith(PMStatus.ENDED);
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
              traceFactory(BaseNode.Utils.TraceType.BLOCK, { blockID: BLOCK_ID }),
              traceFactory(BaseNode.Utils.TraceType.SPEAK, {
                src: SRC,
                type: SpeakTraceAudioType.MESSAGE,
                voice: 'voice',
                message: MESSAGE,
                choices: [],
              }),
              traceFactory(BaseNode.Utils.TraceType.STREAM, { src: SRC, action: BaseNode.Stream.TraceStreamAction.PLAY, token: '1' }),
            ],
          },
          {
            trace: [
              traceFactory(BaseNode.Utils.TraceType.CHOICE, { choices: [{ name: 'name_1' }, { name: 'name_2' }, { name: 'name_3' }] }),
              traceFactory(BaseNode.Utils.TraceType.FLOW, { diagramID: 'diagramID' }),
              traceFactory(BaseNode.Utils.TraceType.END, {}),
            ],
          }
        );

        await controller.next();

        Object.values(TraceMethods).forEach((method) => expect(controller[method]).toBeCalled());
        expectUpdateStatus(controller).toBeCalledWith(PMStatus.ENDED);
      });

      it('should not process traces if stopped', async () => {
        const controller = createController({
          context: { trace: [traceFactory(BaseNode.Utils.TraceType.BLOCK, { blockID: BLOCK_ID })] },
        });

        controller['stopped'] = true;

        await controller.next();

        expectUpdateStatus(controller).not.toBeCalledWith(PMStatus.NAVIGATING);
      });
    });

    describe('stop()', () => {
      it('should clear and stop  trace', () => {
        const controller = createController();

        controller['trace'] = [traceFactory(BaseNode.Utils.TraceType.BLOCK, { blockID: BLOCK_ID })];

        controller.stop();

        expect(controller['trace']).toEqual([]);
        expect(controller['stopped']).toBeTruthy();
        expect(controller['props']['getEngine']()!['prototype']['reset']).toBeCalled();
      });
    });

    describe('flushTrace()', () => {
      it('should only log messages', async () => {
        const controller = createController();

        const speakTrace = traceFactory(BaseNode.Utils.TraceType.SPEAK, {
          src: SRC,
          type: SpeakTraceAudioType.MESSAGE,
          voice: 'voice',
          message: MESSAGE,
          choices: [],
        });

        const audioTrace = traceFactory(BaseNode.Utils.TraceType.STREAM, { src: SRC, action: BaseNode.Stream.TraceStreamAction.PLAY, token: '1' });

        controller['trace'] = [
          traceFactory(BaseNode.Utils.TraceType.BLOCK, { blockID: BLOCK_ID }),
          speakTrace,
          audioTrace,
          traceFactory(BaseNode.Utils.TraceType.CHOICE, { choices: [{ name: 'name_1' }, { name: 'name_2' }, { name: 'name_3' }] }),
          traceFactory(BaseNode.Utils.TraceType.FLOW, { diagramID: 'diagramID' }),
          traceFactory(BaseNode.Utils.TraceType.END, {}),
        ];

        await controller.flushTrace();

        expectMessage(controller, 'speak', speakTrace);
        expectMessage(controller, 'stream', audioTrace);
        expectAudioPlay(controller).not.toBeCalled();
      });
    });
  }
);
