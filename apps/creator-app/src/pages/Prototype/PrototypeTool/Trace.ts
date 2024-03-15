import { AlexaNode } from '@voiceflow/alexa-types';
import { BaseModels, BaseNode, BaseTrace } from '@voiceflow/base-types';
import { Nullish, Utils } from '@voiceflow/common';
import { BaseRequest, RequestType } from '@voiceflow/dtos';
import * as DTOs from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _findLast from 'lodash/findLast';

import { GENERAL_RUNTIME_ENDPOINT, IS_TEST } from '@/config';
import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Domain from '@/ducks/domain';
import * as Prototype from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import * as TrackingEvents from '@/ducks/tracking/events';
import { IDSelectorParam } from '@/ducks/utils/crudV2';
import {
  BlockTrace,
  CardV2Trace,
  CarouselTrace,
  ChannelActionTrace,
  ChoiceTrace,
  FlowTrace,
  GoToTrace,
  NoReplyTrace,
  SpeakTrace,
  StreamTrace,
  TextTrace,
  Trace,
  V1Trace,
  VisualTrace,
} from '@/models';
import type Engine from '@/pages/Canvas/engine';
import { loadImage } from '@/utils/dom';
import { Logger } from '@/utils/logger';

import { Interaction, PMStatus } from '../types';
import AudioController from './Audio';
import MessageController from './Message';
import TimeoutController from './Timeout';
import { appendActivePaths, getUpdatedActivePathContextHistory, isV1Trace } from './utils';

const MUTED_MESSAGE_DELAY = 250;

// Trace types that can have a faked delay
const BOT_TRACE_TYPES = new Set([BaseTrace.TraceType.TEXT, BaseTrace.TraceType.SPEAK, BaseTrace.TraceType.CAROUSEL, BaseTrace.TraceType.CARD_V2]);
type BotTraceType = TextTrace | SpeakTrace | CarouselTrace | CardV2Trace;

export enum StepDirection {
  FORWARD = 'forward',
  BACK = 'back',
}

export interface TraceControllerProps {
  debug: boolean;
  getEngine: () => Nullish<Engine>;
  isMuted?: boolean;
  isPublic?: boolean;
  enterDiagram?: (diagramID: string) => void;
  contextStep: number;
  waitVisuals: boolean;
  updateStatus: (status: PMStatus) => void;
  fetchContext: (request: BaseRequest | null) => Promise<Prototype.Context | null>;
  flowIDHistory: string[];
  contextHistory: Partial<Prototype.Context>[];
  activeDiagramID: string | null;
  setInteractions: (interactions: Interaction[]) => void;
  updatePrototype: (payload: Partial<Prototype.PrototypeState>) => void;
  getLinksByPortID: (portID: IDSelectorParam) => Realtime.Link[];
  activePaths: Record<string, Prototype.ActivePath>;
  visualDataHistory: (null | BaseNode.Visual.StepData)[];
  updatePrototypeVisualsData: (data: null | BaseNode.Visual.StepData) => void;
  updatePrototypeVisualsDataHistory: (dataHistory: (null | BaseNode.Visual.StepData)[]) => void;
  setError: VoidFunction | ((error: string) => Promise<void>);
  globalMessageDelayMilliseconds?: number;
}

interface Options {
  props: TraceControllerProps;
  audio?: AudioController;
  logger: Logger;
  message: MessageController;
  timeout: TimeoutController;
}

interface StreamState {
  src: string | null;
  token: string | null;
  offset: number;
}

const findLastBlockTrace = (trace: Trace[]) => _findLast(trace, ({ type }) => type === BaseTrace.TraceType.BLOCK);

const WAIT_ENTITY_TIME = 200;
const MIN_FOCUSED_NODE_TIME = 500;
const WAIT_DISPLAY_TIME = 1000;

// Nodes that get focused when debug mode is off
const FOCUSABLE_NODES = new Set([
  BlockType.START,
  BlockType.COMBINED,
  BlockType.COMMAND,
  BlockType.SPEAK,
  BlockType.TEXT,
  BlockType.CAROUSEL,
  BlockType.CARDV2,
  BlockType.CARD,
  BlockType.CAPTURE,
  BlockType.CAPTUREV2,
  BlockType.CHOICE,
  BlockType.INTENT,
  BlockType.STREAM,
  BlockType.COMPONENT,
  BlockType.EXIT,
  BlockType.PROMPT,
  BlockType.VISUAL,
  BlockType.DISPLAY,
  BlockType.EVENT,
]);

class TraceController {
  private trace: Trace[] = [];

  private props: Options['props'];

  private audio: Options['audio'];

  private logger: Options['logger'];

  private stopped = false;

  private message: Options['message'];

  private timeout: Options['timeout'];

  private context: Prototype.Context | null = null;

  private prototypeID: string | null = null;

  private streamState: StreamState = { src: null, offset: 0, token: null };

  private noReplyTimeout = 0;

  private fakeLoadingPromiseTimeout = 0;

  public topTrace: Trace | null = null;

  get isPublicPrototype(): boolean {
    return !!this.props.isPublic;
  }

  public resetInteractions(): void {
    this.props.setInteractions([]);
  }

  constructor({ audio, props, logger, message, timeout }: Options) {
    this.props = props;
    this.audio = audio;
    this.logger = logger;
    this.timeout = timeout;
    this.message = message;
  }

  public start() {
    this.startPrototypeEngine();

    this.prototypeID = Utils.id.objectID();
  }

  public next = async (request: BaseRequest | null = null): Promise<void> => {
    const currentContextStep = this.props.contextStep;
    const { contextHistory } = this.props;
    const { visualDataHistory } = this.props;
    const historyLength = contextHistory.length;

    // Remove any forward history
    if (currentContextStep !== historyLength - 1) {
      const newHistoryArray = contextHistory.slice(0, currentContextStep + 1);
      const newVisualsDataArray = visualDataHistory.slice(0, currentContextStep + 1);

      this.props.updatePrototype({ contextHistory: newHistoryArray });
      this.props.updatePrototypeVisualsDataHistory(newVisualsDataArray);
    }

    this.props.updateStatus(PMStatus.FETCHING_CONTEXT);

    this.timeout.clearByID(this.noReplyTimeout);

    this.context = await this.props.fetchContext(request);

    if (this.stopped) return;

    if (!this.context) {
      if (GENERAL_RUNTIME_ENDPOINT && !GENERAL_RUNTIME_ENDPOINT.includes('voiceflow')) {
        this.setError(`Unable to fetch response from custom endpoint: ${GENERAL_RUNTIME_ENDPOINT}`);
      } else {
        this.setError('Unable to fetch response');
      }

      return;
    }

    if (!this.context.trace.length) {
      return;
    }

    this.audio?.stop();
    this.props.getEngine()?.prototype.setFinalNodeID(null);

    if (IS_TEST) {
      await this.processTrace(this.context.trace);
    } else {
      this.processTrace(this.context.trace);
    }
  };

  public historyStep = async (direction: StepDirection): Promise<void> => {
    const offset = direction === StepDirection.BACK ? -1 : 1;
    const currentContextStep = this.props.contextStep;
    const newContextStepNumber = currentContextStep + offset;
    const { contextHistory } = this.props;
    const { visualDataHistory } = this.props;
    const targetDiagramID =
      direction === StepDirection.BACK
        ? contextHistory[currentContextStep].previousContextDiagramID
        : contextHistory[newContextStepNumber].targetContextDiagramID;

    this.resetInteractions();

    if (targetDiagramID && this.props.activeDiagramID !== targetDiagramID && this.props.enterDiagram) {
      this.props.enterDiagram(targetDiagramID);

      await this.waitDiagram(targetDiagramID);
    }

    const activePathsSnapshot = contextHistory[newContextStepNumber]?.activePaths || {};

    this.props.updatePrototype({
      contextStep: newContextStepNumber,
      activePaths: activePathsSnapshot,
    });

    const targetContext = contextHistory[newContextStepNumber];
    const targetVisualData = visualDataHistory[newContextStepNumber];
    const targetTrace = targetContext!.trace;
    const targetBlockTraceFrame = findLastBlockTrace(targetTrace!) as BlockTrace;
    const targetStepTrace = targetTrace![targetTrace!.length - 1];
    const targetBlockID = targetBlockTraceFrame.payload?.blockID;

    // wait for the block to render (to account for switching between components)
    await this.waitNode(targetBlockID);

    this.props.getEngine()?.prototype.setFinalNodeID(null);

    await this.processTrace([targetBlockTraceFrame, targetStepTrace]);

    this.props.updatePrototype({ context: targetContext as Prototype.Context });
    this.props.updatePrototypeVisualsData(targetVisualData);

    this.context = {
      ...targetContext,
      trace: targetContext.trace?.map((trace: Trace) => ({ ...trace, id: Utils.id.cuid() })) ?? [],
    } as Prototype.Context;
  };

  public stop(): void {
    this.trace = [];
    this.stopped = true;
    this.topTrace = null;
    this.prototypeID = null;

    this.timeout.clearByID(this.noReplyTimeout);
    this.stopPrototypeEngine();
  }

  // immediate display the remaining traces and not wait on any async effects
  public async flushTrace(): Promise<void> {
    this.timeout.clearByID(this.fakeLoadingPromiseTimeout);

    await this.processTrace(this.trace, { onlyMessage: true });
  }

  public navigateToStep(messageID: string): void {
    if (!this.context?.trace) return;

    let blockID: string | null = null;
    let diagramID: string | null = null;

    for (const trace of this.context.trace) {
      if (trace.id === messageID) break;

      if (trace.type === BaseTrace.TraceType.FLOW) {
        diagramID = trace.payload.diagramID;
      } else if (trace.type === BaseTrace.TraceType.BLOCK) {
        blockID = trace.payload.blockID;
      }
    }

    if (!blockID) return;

    if (!diagramID || diagramID === this.props.activeDiagramID) {
      this.props.getEngine()?.store.dispatch(Router.goToCurrentCanvas());
      this.props.getEngine()?.focusNode(blockID, { open: true });
    } else {
      const domainID =
        this.props.getEngine()?.select(Domain.domainIDByTopicIDSelector, { topicID: diagramID }) ??
        this.props.getEngine()?.select(Domain.rootDomainIDSelector);

      if (domainID) {
        this.props.getEngine()?.store.dispatch(Router.goToDomainDiagram(domainID, diagramID, blockID));
      }
    }
  }

  private isVeryFirstBotMessage(trace: BotTraceType) {
    if (this.props.contextStep !== 1) return false;
    if (!BOT_TRACE_TYPES.has(trace.type)) return false;

    return this.context?.trace.find(({ type }) => BOT_TRACE_TYPES.has(type))?.id === trace.id;
  }

  private async simulateLoadingDelay(trace: BotTraceType, { delay, skip }: { delay?: number; skip?: boolean } = {}) {
    const isVeryFirstMessage = this.isVeryFirstBotMessage(trace);
    const delayInMilliseconds = delay ?? this.props.globalMessageDelayMilliseconds;

    if (skip || isVeryFirstMessage || !delayInMilliseconds) return;

    this.props.updateStatus(PMStatus.FAKE_LOADING);

    const promise = this.timeout.delay(delayInMilliseconds);

    this.fakeLoadingPromiseTimeout = promise.timeoutID;

    await promise;

    this.props.updateStatus(PMStatus.NAVIGATING);
  }

  private async processTrace(trace: Trace[], { onlyMessage = false }: { onlyMessage?: boolean } = {}): Promise<void> {
    if (this.stopped) return;

    const [topTrace, ...tailTrace] = trace;

    if (!topTrace) {
      this.logger.debug('Nothing to process, waiting user interaction');

      this.props.updateStatus(PMStatus.WAITING_USER_INTERACTION);
      return;
    }

    this.props.updateStatus(PMStatus.NAVIGATING);

    this.trace = tailTrace;
    this.topTrace = topTrace;

    if (!this.isPublicPrototype) {
      await this.waitEngineAndNodes();
    }

    this.logger.debug('Processing trace', topTrace);

    // TODO: find a far less uglier way to do this
    if (topTrace.type === BaseTrace.TraceType.CHOICE && DTOs.ChoiceTraceDTO.safeParse(topTrace).success) {
      this.processChoiceTrace(topTrace);
    } else if (topTrace.type === BaseTrace.TraceType.BLOCK && DTOs.BlockTraceDTO.safeParse(topTrace).success) {
      await this.processBlockTrace(topTrace, { isLast: !tailTrace.length, onlyMessage });
    } else if (topTrace.type === BaseTrace.TraceType.STREAM && DTOs.StreamTraceDTO.safeParse(topTrace).success) {
      await this.processStreamTrace(topTrace, { onlyMessage });
    } else if (topTrace.type === BaseTrace.TraceType.SPEAK && DTOs.SpeakTraceDTO.safeParse(topTrace).success) {
      const isNextTraceElicitEntityFilling = trace.find((trace) => trace.type === BaseTrace.TraceType.ENTITY_FILLING)?.payload.intent.ELICIT;
      await this.processSpeakTrace(topTrace, { onlyMessage }, isNextTraceElicitEntityFilling ?? false);
    } else if (topTrace.type === BaseTrace.TraceType.TEXT && DTOs.TextTraceDTO.safeParse(topTrace).success) {
      await this.processTextTrace(topTrace, { onlyMessage });
    } else if (topTrace.type === ('knowledgeBase' as any)) {
      const nextTrace = trace.find((trace) => [BaseTrace.TraceType.TEXT, BaseTrace.TraceType.SPEAK].includes(trace.type));
      if (nextTrace && Array.isArray(topTrace.payload.chunks)) {
        nextTrace.payload.knowledgeBase = topTrace.payload.chunks.map((chunk: any) => chunk?.documentData);
      }
    } else if (topTrace.type === BaseTrace.TraceType.CAROUSEL && DTOs.CarouselTraceDTO.safeParse(topTrace).success) {
      await this.processCarouselTrace(topTrace, { onlyMessage });
    } else if (topTrace.type === BaseTrace.TraceType.CARD_V2 && DTOs.CardTraceDTO.safeParse(topTrace).success) {
      await this.processCardTrace(topTrace, { onlyMessage });
    } else if (topTrace.type === BaseTrace.TraceType.FLOW && DTOs.FlowTraceDTO.safeParse(topTrace).success) {
      await this.processFlowTrace(topTrace);
    } else if (topTrace.type === BaseTrace.TraceType.END && DTOs.ExitTraceDTO.safeParse(topTrace).success) {
      await this.processEndTrace();
      return;
    } else if (topTrace.type === BaseTrace.TraceType.VISUAL && DTOs.VisualTraceDTO.safeParse(topTrace).success) {
      await this.processVisualTrace(topTrace);
    } else if (topTrace.type === BaseTrace.TraceType.DEBUG && DTOs.DebugTraceDTO.safeParse(topTrace).success) {
      this.message.debug(topTrace);
    } else if (topTrace.type === BaseTrace.TraceType.GOTO && DTOs.GoToTraceDTO.safeParse(topTrace).success) {
      this.processGoToTrace(topTrace);
      return; // don't process the rest of the traces
    } else if (topTrace.type === BaseTrace.TraceType.NO_REPLY && DTOs.NoReplyTraceDTO.safeParse(topTrace).success) {
      this.processNoReplyTrace(topTrace);
    } else if (topTrace.type === BaseTrace.TraceType.CHANNEL_ACTION && DTOs.ChannelActionTraceDTO.safeParse(topTrace).success) {
      // map alexa display to visual to improve prototoype experience
      if (topTrace.payload.name === AlexaNode.NodeType.DISPLAY) {
        const visualTrace: VisualTrace = {
          id: topTrace.id,
          payload: {
            image: topTrace.payload.payload.imageURL,
            device: null,
            dimensions: null,
            canvasVisibility: BaseNode.Visual.CanvasVisibility.FULL,
            visualType: BaseNode.Visual.VisualType.IMAGE,
          },
          type: BaseTrace.TraceType.VISUAL,
        };
        await this.processVisualTrace(visualTrace);
      } else {
        this.message.channelAction(topTrace);
        if (!tailTrace.length) this.processPathTrace(topTrace);
      }
    } else if (isV1Trace(topTrace) && !tailTrace.length) {
      this.processPathTrace(topTrace);
    } else {
      console.warn('Unsupported trace found!', topTrace); // eslint-disable-line no-console
    }

    if (this.trace === tailTrace) {
      await this.processTrace(tailTrace, { onlyMessage });
    }
  }

  private processChoiceTrace({ payload: { buttons = [] } }: ChoiceTrace) {
    this.props.setInteractions(buttons);
  }

  private processPathTrace(trace: V1Trace | ChannelActionTrace) {
    const interactions = trace.paths?.reduce<Interaction[]>((acc, path) => {
      if (path.event) {
        const { type } = path.event;

        acc.push({
          name: path.label || type,
          request: { type, payload: path.label || undefined },
          isActionButton: true,
        });
      }

      return acc;
    }, []);

    this.props.setInteractions(interactions ?? []);
  }

  private async processBlockTrace(trace: BlockTrace, { onlyMessage }: { isLast?: boolean; onlyMessage?: boolean } = {}) {
    const engine = this.props.getEngine();
    const node = engine?.getNodeByID(trace.payload.blockID);

    if (engine && node && node.type === BlockType.CUSTOM_BLOCK_POINTER) {
      engine.dispatcher.dispatch(TrackingEvents.trackCustomBlockPrototyped({ prototypeID: `${this.prototypeID}` }));
    }

    if (!this.isPublicPrototype) {
      await this.waitNode(trace.payload.blockID);
    }

    if (node?.id) {
      engine?.selection.replaceNode([node.id]);
    }

    if (node && !this.isPublicPrototype) {
      await this.highlightBlock(node, onlyMessage);
    }
  }

  private async processVisualTrace(trace: VisualTrace) {
    const { payload } = trace;
    const { visualType } = payload;
    const isImageType = visualType === BaseNode.Visual.VisualType.IMAGE;
    const image = isImageType ? payload.image : payload.imageURL;

    if (image) {
      await loadImage(image).catch(() => null);
    }

    this.message.visual(trace);

    this.props.updatePrototypeVisualsData(payload);

    if (this.props.waitVisuals) {
      await this.timeout.delay(WAIT_DISPLAY_TIME);
    }
  }

  private async processStreamTrace(trace: StreamTrace, { onlyMessage }: { isLast?: boolean; onlyMessage?: boolean }) {
    const { src, action, token, loop } = trace.payload;

    const ending = action === BaseNode.Stream.TraceStreamAction.END;
    if (ending) {
      return;
    }

    this.message.stream(trace);

    const pausing = action === BaseNode.Stream.TraceStreamAction.PAUSE;

    this.props.setInteractions([
      { name: 'next', request: { type: RequestType.TEXT, payload: 'next' } },
      { name: 'previous', request: { type: RequestType.TEXT, payload: 'previous' } },
      { name: pausing ? 'resume' : 'pause', request: { type: RequestType.TEXT, payload: pausing ? 'resume' : 'pause' } },
    ]);

    this.props.updateStatus(PMStatus.WAITING_USER_INTERACTION);

    if (pausing) {
      this.audio?.stop();
      return;
    }

    if (onlyMessage) {
      return;
    }

    if (token !== this.streamState.token) {
      this.streamState = { src, token, offset: 0 };
    }

    if (this.props.isMuted) {
      await Utils.promise.delay(MUTED_MESSAGE_DELAY);
    } else {
      try {
        await this.audio?.play(src, {
          loop,
          muted: this.props.isMuted,
          offset: this.streamState.offset,
          onStop: (audio) => {
            this.streamState.offset = audio.currentTime;
          },
          onError: this.setError,
        });
      } catch {
        return;
      }
    }

    this.resetInteractions();

    await this.next({ type: RequestType.TEXT, payload: VoiceflowConstants.IntentName.NEXT });
  }

  private async processTextTrace(trace: TextTrace, { onlyMessage }: { onlyMessage?: boolean } = {}) {
    await this.simulateLoadingDelay(trace, { delay: trace.payload?.slate?.messageDelayMilliseconds, skip: onlyMessage });

    await this.message.text(trace);
  }

  private async processCarouselTrace(trace: CarouselTrace, { onlyMessage }: { onlyMessage?: boolean } = {}) {
    await this.simulateLoadingDelay(trace, { skip: onlyMessage });

    await this.message.carousel(trace);
  }

  private async processCardTrace(trace: CardV2Trace, { onlyMessage }: { onlyMessage?: boolean } = {}) {
    await this.simulateLoadingDelay(trace, { skip: onlyMessage });

    await this.message.card(trace);
  }

  private async processSpeakTrace(trace: SpeakTrace, { onlyMessage }: { onlyMessage?: boolean } = {}, isElicit = false) {
    await this.simulateLoadingDelay(trace, { skip: onlyMessage });

    const projectPlatform = this.props.getEngine()?.getActivePlatform();

    // if it is alexa AND current request is elict AND prompt => ignore
    if (projectPlatform === VoiceflowConstants.PlatformType.ALEXA && trace.payload.isPrompt && isElicit) {
      return;
    }
    this.message.speak(trace);

    if (onlyMessage) {
      return;
    }

    if (this.props.isMuted) {
      await Utils.promise.delay(MUTED_MESSAGE_DELAY);
    } else {
      await this.audio?.play(trace.payload.src, { muted: this.props.isMuted, onError: this.setError }).catch(Utils.functional.noop);
    }
  }

  private async processFlowTrace({ payload: { diagramID } }: FlowTrace) {
    if (!diagramID || !this.props.enterDiagram) {
      return;
    }

    if (!this.isPublicPrototype) {
      await this.navigateToFlow(diagramID);
    }
  }

  private async processGoToTrace({ payload: { request } }: GoToTrace) {
    await this.next(request);
  }

  private processNoReplyTrace({ payload: { timeout } }: NoReplyTrace) {
    if (!timeout) {
      return;
    }

    // timeout is in seconds
    this.noReplyTimeout = this.timeout.set(timeout * 1000, () => {
      this.resetInteractions();
      this.next({ type: BaseTrace.TraceType.NO_REPLY, payload: null });
    });
  }

  private async processEndTrace() {
    this.logger.debug('Ending conversation');

    const lastNodeID = findLastBlockTrace(this.context?.trace ?? [])?.payload.blockID;

    this.props.getEngine()?.selection.reset();

    if (lastNodeID) {
      this.props.getEngine()?.prototype.setFinalNodeID(lastNodeID);
    }

    this.props.updateStatus(PMStatus.ENDED);
  }

  private saveActivePathBlock(nodeID: string) {
    const updatedActivePaths = appendActivePaths(this.props.activePaths, { diagramID: this.props.activeDiagramID!, blockIDs: [nodeID] });
    const updatedContextHistory = getUpdatedActivePathContextHistory(this.props.contextStep, this.props.contextHistory, updatedActivePaths);

    this.props.updatePrototype({
      activePaths: updatedActivePaths,
      contextHistory: updatedContextHistory,
    });
  }

  private async highlightBlock(node: Realtime.Node, skipDelay = false) {
    const hasParent = !!node.parentNode;
    const nodeType = node?.type;
    const highlightedBlocks = this.props.getEngine()?.select(Prototype.activePathByDiagramIDSelector)(this.props.activeDiagramID!)?.blockIDs || [];
    const parentBlockAlreadyHighlighted = !!highlightedBlocks?.includes(node?.parentNode || '');

    if (parentBlockAlreadyHighlighted) {
      return;
    }

    this.logger.debug('Highlighting block', node, { skipDelay });

    const [, sourceNodeID] = Utils.array.tail(highlightedBlocks);

    if (hasParent) {
      await this.saveActivePathBlock(node.parentNode!);
    } else if (nodeType === Realtime.BlockType.START) {
      await this.saveActivePathBlock(node.id);
    }

    this.saveActivePathLink(sourceNodeID, node);

    if ((hasParent && FOCUSABLE_NODES.has(nodeType)) || this.props.debug || !nodeType) {
      let parentNodeID = node.parentNode;

      if (parentNodeID) {
        const parent = this.props.getEngine()?.getNodeByID(node.parentNode);

        if (parent?.type === BlockType.ACTIONS) {
          const linkID = this.props.getEngine()?.getLinkIDsByNodeID(parent.id)?.[0];

          const linkedSourceNode = this.props.getEngine()?.getSourceNodeByLinkID(linkID);

          parentNodeID = linkedSourceNode?.id ?? null;
        }
      }

      if (parentNodeID) {
        this.focusNode(parentNodeID);
      }

      if (skipDelay) return;

      await this.timeout.delay(MIN_FOCUSED_NODE_TIME);
    }
  }

  private async navigateToFlow(diagramID: string) {
    this.logger.debug(`Navigating to diagram: ${diagramID}`);

    if (!this.props.enterDiagram) return;

    this.props.enterDiagram(diagramID);

    const currentFlowStack = this.props.flowIDHistory;
    const flowAlreadyInHistory = currentFlowStack.includes(diagramID);

    if (!flowAlreadyInHistory) {
      this.props.updatePrototype({ flowIDHistory: [...currentFlowStack, diagramID] });
    }

    await this.waitDiagram(diagramID);
    await this.waitEngineAndNodes();
    this.startPrototypeEngine();

    // force re-render of active paths
    this.props.updatePrototype({ activePaths: { ...this.props.activePaths } });
  }

  private setError = (message = 'Unable to play an audio') => {
    this.props.updateStatus(PMStatus.ERROR);
    this.props.setError(message);
  };

  private findLinkBetween(sourceID: string, targetID: string): string | null {
    const source = this.props.getEngine()?.getNodeByID(sourceID);
    const [, sourceLastChild] = Utils.array.tail(source?.combinedNodes ?? []);
    const sourceIDs = [sourceID, ...(sourceLastChild ? [sourceLastChild] : [])];

    const target = this.props.getEngine()?.getNodeByID(targetID);
    const [targetFirstChild] = this.props.getEngine()?.getNodeByID(target?.parentNode)?.combinedNodes ?? [];
    const targetIDs = [targetID, ...(targetID === targetFirstChild ? [target!.parentNode!] : [])];

    const getJoiningLinks = (sourceNodeID: string, targetNodeID: string) =>
      this.props.getEngine()?.select(CreatorV2.joiningLinkIDsSelector, { sourceNodeID, targetNodeID, directional: true }) ?? [];
    const [linkID] = sourceIDs.flatMap((id) => targetIDs.flatMap((linkTargetID) => getJoiningLinks(id, linkTargetID) ?? []));

    return linkID ?? null;
  }

  private saveActivePathLink(sourceNodeID: string, targetNode: Realtime.Node) {
    const activePathLinkID = this.findLinkBetween(sourceNodeID, targetNode.id);

    let outLinkIDs: string[] = [];

    // We need to prematurely highlight the out link of a node block (if it exists)
    // because the regular active path logic doesn't account for that case
    if (targetNode.type === BlockType.COMPONENT) {
      const builtIn = (targetNode.ports.out.builtIn ?? {}) as Realtime.NodeData.FlowBuiltInPorts | Realtime.NodeData.ComponentBuiltInPorts;

      const outPort = builtIn[BaseModels.PortType.NEXT] as unknown as IDSelectorParam;
      const linksByPortID = outPort ? this.props.getLinksByPortID(outPort) : [];
      const outLinkID = linksByPortID?.[0]?.id;

      outLinkIDs = outLinkID ? [outLinkID] : [];
    }

    if (!activePathLinkID) return;

    const updatedActivePaths = appendActivePaths(this.props.activePaths, {
      diagramID: this.props.activeDiagramID!,
      linkIDs: [...outLinkIDs, activePathLinkID],
    });

    const updatedContextHistory = getUpdatedActivePathContextHistory(this.props.contextStep, this.props.contextHistory, updatedActivePaths);

    this.props.updatePrototype({ activePaths: updatedActivePaths, contextHistory: updatedContextHistory });
  }

  private focusNode(nodeID: string) {
    this.logger.debug(`Focusing node: ${nodeID}`);

    this.props.getEngine()?.node.center(nodeID);
  }

  private async waitFor(condition: () => boolean, rejectTimeout = 15000) {
    let waitingTime = 0;

    while (!condition()) {
      // eslint-disable-next-line no-await-in-loop
      await this.timeout.delay(WAIT_ENTITY_TIME);

      waitingTime += WAIT_ENTITY_TIME;

      if (waitingTime >= rejectTimeout) throw new Error('Timeout');
    }
  }

  private startPrototypeEngine() {
    const engine = this.props.getEngine();
    engine?.prototype.subscribe();
  }

  private stopPrototypeEngine() {
    const engine = this.props.getEngine();
    engine?.prototype.reset();
  }

  private async waitNode(nodeID: string) {
    this.logger.debug(`Waiting for node: ${nodeID}`);

    if (!nodeID) return;

    await this.waitFor(() => !!this.props.getEngine()?.getNodeByID(nodeID));
  }

  private async waitDiagram(diagramID: string) {
    this.logger.debug(`Waiting for diagram: ${diagramID}`);

    if (!diagramID) return;

    await this.waitFor(() => this.props.activeDiagramID === diagramID);
  }

  private async waitEngineAndNodes() {
    this.logger.debug('Waiting for engine and nodes');

    await this.waitFor(() => !!this.props.getEngine()?.isSynced());
  }
}

export default TraceController;
