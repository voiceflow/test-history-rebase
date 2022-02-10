import { BaseModels, BaseNode, BaseRequest, BaseTrace } from '@voiceflow/base-types';
import { Nullish, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _findLast from 'lodash/findLast';

import { GENERAL_RUNTIME_ENDPOINT, IS_TEST } from '@/config';
import { BlockType, START_BLOCK_ID } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Prototype from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import {
  BlockTrace,
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
import { Engine } from '@/pages/Canvas/engine';
import { loadImage } from '@/utils/dom';

import { Interaction, PMStatus } from '../types';
import AudioController from './Audio';
import MessageController from './Message';
import TimeoutController from './Timeout';
import { getUpdatedContextHistory, isV1Trace } from './utils';

const MUTED_MESSAGE_DELAY = 250;

// Trace types that can have a faked delay
const BOT_TRACE_TYPES = [BaseTrace.TraceType.TEXT, BaseTrace.TraceType.SPEAK];
type BotTraceType = TextTrace | SpeakTrace;

export enum StepDirection {
  FORWARD = 'forward',
  BACK = 'back',
}

export interface TraceControllerProps {
  debug: boolean;
  getEngine: () => Nullish<Engine>;
  isMuted: boolean;
  setError: (error: string) => void;
  isPublic?: boolean;
  enterFlow: (diagramID: string) => void;
  contextStep: number;
  waitVisuals: boolean;
  updateStatus: (status: PMStatus) => void;
  fetchContext: (request: BaseRequest.BaseRequest | null) => Promise<Prototype.Context | null>;
  flowIDHistory: string[];
  contextHistory: Partial<Prototype.Context>[];
  activeDiagramID: string | null;
  setInteractions: (interactions: Interaction[]) => void;
  updatePrototype: (payload: Partial<Prototype.PrototypeState>) => void;
  getLinksByPortID: (portID: string) => Realtime.Link[];
  activePathLinkIDs: string[];
  visualDataHistory: (null | BaseNode.Visual.StepData)[];
  activePathBlockIDs: string[];
  updatePrototypeVisualsData: (data: null | BaseNode.Visual.StepData) => void;
  updatePrototypeVisualsDataHistory: (dataHistory: (null | BaseNode.Visual.StepData)[]) => void;
  globalMessageDelayMilliseconds?: number;
}

interface Options {
  props: TraceControllerProps;
  audio: AudioController;
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
const FOCUSABLE_NODES = [
  BlockType.START,
  BlockType.COMBINED,
  BlockType.COMMAND,
  BlockType.SPEAK,
  BlockType.TEXT,
  BlockType.CAPTURE,
  BlockType.CAPTUREV2,
  BlockType.CHOICE,
  BlockType.INTENT,
  BlockType.STREAM,
  BlockType.FLOW,
  BlockType.EXIT,
  BlockType.PROMPT,
  BlockType.VISUAL,
  BlockType.DISPLAY,
  BlockType.EVENT,
];

class TraceController {
  private trace: Trace[] = [];

  private props: Options['props'];

  private audio: Options['audio'];

  private stopped = false;

  private message: Options['message'];

  private timeout: Options['timeout'];

  private context: Prototype.Context | null = null;

  private streamState: StreamState = { src: null, offset: 0, token: null };

  private noReplyTimeout = 0;

  get isPublicPrototype(): boolean {
    return !!this.props.isPublic;
  }

  public resetInteractions(): void {
    this.props.setInteractions([]);
  }

  constructor({ audio, props, message, timeout }: Options) {
    this.props = props;
    this.audio = audio;
    this.timeout = timeout;
    this.message = message;
  }

  public next = async (request: BaseRequest.BaseRequest | null = null): Promise<void> => {
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

    if (this.stopped) {
      return;
    }

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

    this.audio.stop();
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

    if (targetDiagramID && this.props.activeDiagramID !== targetDiagramID && this.props.enterFlow) {
      this.props.enterFlow(targetDiagramID);
      await this.waitDiagram(targetDiagramID);
    }

    const activePathBlockIDsSnapshot = contextHistory[newContextStepNumber]?.activePathBlockIDs || [];
    const activePathLinkIDsSnapshot = contextHistory[newContextStepNumber]?.activePathLinkIDs || [];

    this.props.updatePrototype({
      contextStep: newContextStepNumber,
      activePathLinkIDs: activePathLinkIDsSnapshot,
      activePathBlockIDs: activePathBlockIDsSnapshot,
    });

    const targetContext = contextHistory[newContextStepNumber];
    const targetVisualData = visualDataHistory[newContextStepNumber];
    const targetTrace = targetContext!.trace;
    const targetBlockTraceFrame = findLastBlockTrace(targetTrace!) as BlockTrace;
    const targetStepTrace = targetTrace![targetTrace!.length - 1];
    const targetBlockID = targetBlockTraceFrame.payload?.blockID;

    // wait for the block to render (to account for switching between flows)
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

    this.timeout.clearByID(this.noReplyTimeout);
  }

  // immediate display the remaining traces and not wait on any async effects
  public async flushTrace(): Promise<void> {
    await this.processTrace(this.trace, { onlyMessage: true });
  }

  public navigateToStep(messageID: string): void {
    if (!this.context?.trace) return;

    let blockID: string | null = null;
    let diagramID: string | null = null;

    // eslint-disable-next-line no-restricted-syntax
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
      this.props.getEngine()?.store.dispatch(Router.goToDiagram(diagramID, blockID));
    }
  }

  private isVeryFirstBotMessage(trace: BotTraceType) {
    if (this.props.contextStep !== 1) return false;
    if (!BOT_TRACE_TYPES.includes(trace.type)) return false;

    return this.context?.trace.find(({ type }) => BOT_TRACE_TYPES.includes(type))?.id === trace.id;
  }

  private async simulateLoadingDelay(trace: BotTraceType, delayMillisecondsOverride?: number) {
    const isVeryFirstMessage = this.isVeryFirstBotMessage(trace);
    const delayInMilliseconds = delayMillisecondsOverride ?? this.props.globalMessageDelayMilliseconds;
    if (isVeryFirstMessage || !delayInMilliseconds) return;

    this.props.updateStatus(PMStatus.FAKE_LOADING);
    await this.timeout.delay(delayInMilliseconds);
    this.props.updateStatus(PMStatus.NAVIGATING);
  }

  private async processTrace(trace: Trace[], { onlyMessage = false }: { onlyMessage?: boolean } = {}): Promise<void> {
    if (this.stopped) {
      return;
    }

    const [topTrace, ...tailTrace] = trace;

    if (!topTrace) {
      this.props.updateStatus(PMStatus.WAITING_USER_INTERACTION);
      return;
    }
    this.props.updateStatus(PMStatus.NAVIGATING);

    this.trace = tailTrace;

    if (!this.isPublicPrototype) {
      await this.waitEngineAndNodes();
    }

    switch (topTrace.type) {
      case BaseTrace.TraceType.CHOICE: {
        this.processChoiceTrace(topTrace);
        break;
      }
      case BaseTrace.TraceType.BLOCK: {
        await this.processBlockTrace(topTrace, { isLast: !tailTrace.length, onlyMessage });
        break;
      }
      case BaseTrace.TraceType.STREAM: {
        await this.processStreamTrace(topTrace, { onlyMessage });
        break;
      }
      case BaseTrace.TraceType.SPEAK: {
        await this.processSpeakTrace(topTrace, { onlyMessage });
        break;
      }
      case BaseTrace.TraceType.TEXT: {
        await this.processTextTrace(topTrace);
        break;
      }
      case BaseTrace.TraceType.FLOW: {
        await this.processFlowTrace(topTrace);
        break;
      }
      case BaseTrace.TraceType.END: {
        await this.processEndTrace();
        break;
      }
      case BaseTrace.TraceType.VISUAL: {
        await this.processVisualTrace(topTrace);
        break;
      }
      case BaseTrace.TraceType.DEBUG: {
        await this.message.debug(topTrace);
        break;
      }
      case BaseTrace.TraceType.GOTO: {
        this.processGoToTrace(topTrace);
        return; // don't process the rest of the traces
      }
      case BaseTrace.TraceType.NO_REPLY: {
        this.processNoReplyTrace(topTrace);
        break;
      }
      default:
        if (isV1Trace(topTrace) && !tailTrace.length) {
          this.processPathTrace(topTrace);
        } else {
          console.warn('Unsupported trace found!', topTrace); // eslint-disable-line no-console
        }
    }

    if (this.trace === tailTrace) {
      await this.processTrace(tailTrace, { onlyMessage });
    }
  }

  private processChoiceTrace({ payload: { buttons = [] } }: ChoiceTrace) {
    this.props.setInteractions(buttons);
  }

  private processPathTrace(trace: V1Trace) {
    const interactions = trace.paths.reduce<Interaction[]>((acc, path) => {
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

    this.props.setInteractions(interactions);
  }

  private saveActivePathBlock(node: Realtime.Node) {
    const updatedActivePathBlockArray = Utils.array.unique([...this.props.activePathBlockIDs, node!.parentNode!]);
    const updatedContextHistory = getUpdatedContextHistory(
      this.props.contextStep,
      this.props.contextHistory,
      'activePathBlockIDs',
      updatedActivePathBlockArray
    );

    const updatePrototypeData = {
      activePathBlockIDs: updatedActivePathBlockArray,
      contextHistory: updatedContextHistory,
    };

    this.props.updatePrototype(updatePrototypeData);
  }

  private async processBlockTrace(trace: BlockTrace, { onlyMessage }: { isLast?: boolean; onlyMessage?: boolean } = {}) {
    const node = this.props.getEngine()?.getNodeByID(trace.payload.blockID);

    if (!this.isPublicPrototype) {
      await this.waitNode(trace.payload.blockID);
    }

    if (node?.id) {
      this.props.getEngine()?.selection.replace([node.id]);
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

  private async highlightBlock(node: Realtime.Node, skipDelay = false) {
    const hasParent = !!node.parentNode;
    const nodeType = node?.type;
    const highlightedBlocks = this.props.getEngine()?.select(Prototype.activePathBlockIDsSelector);
    const parentBlockAlreadyHighlighted = !!highlightedBlocks?.includes(node?.parentNode || '');

    if (parentBlockAlreadyHighlighted) {
      return;
    }

    const [, sourceNodeID] = Utils.array.tail(this.props.getEngine()?.select(Prototype.activePathBlockIDsSelector) || []);

    if (hasParent) {
      await this.saveActivePathBlock(node);
    }

    this.saveActivePathLink(sourceNodeID, node);

    if ((hasParent && FOCUSABLE_NODES.includes(nodeType)) || this.props.debug || !nodeType) {
      this.focusNode(node.parentNode!);
      if (skipDelay) return;
      await this.timeout.delay(MIN_FOCUSED_NODE_TIME);
    }
  }

  private async processStreamTrace(trace: StreamTrace, { onlyMessage }: { isLast?: boolean; onlyMessage?: boolean }) {
    const {
      payload: { src, action, token },
    } = trace;
    this.message.stream(trace);

    const pausing = action === BaseNode.Stream.TraceStreamAction.PAUSE;

    this.props.setInteractions([
      { name: 'next', request: { type: BaseRequest.RequestType.TEXT, payload: 'next' } },
      { name: 'previous', request: { type: BaseRequest.RequestType.TEXT, payload: 'previous' } },
      { name: pausing ? 'resume' : 'pause', request: { type: BaseRequest.RequestType.TEXT, payload: pausing ? 'resume' : 'pause' } },
    ]);

    this.props.updateStatus(PMStatus.WAITING_USER_INTERACTION);

    if (pausing) {
      this.audio.stop();
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
        await this.audio.play(src, {
          loop: action === BaseNode.Stream.TraceStreamAction.LOOP,
          muted: this.props.isMuted,
          offset: this.streamState.offset,
          onPause: (audio) => {
            this.streamState.offset = audio.currentTime;
          },
          onError: () => this.setError(),
        });
      } catch {
        return;
      }
    }

    await this.next({ type: BaseRequest.RequestType.TEXT, payload: VoiceflowConstants.IntentName.NEXT });
  }

  private async processTextTrace(trace: TextTrace) {
    await this.simulateLoadingDelay(trace, trace.payload?.slate?.messageDelayMilliseconds);
    await this.message.text(trace);
  }

  private async processSpeakTrace(trace: SpeakTrace, { onlyMessage }: { onlyMessage?: boolean } = {}) {
    await this.simulateLoadingDelay(trace);
    const {
      payload: { src },
    } = trace;
    this.message.speak(trace);

    if (onlyMessage) {
      return;
    }

    if (this.props.isMuted) {
      await Utils.promise.delay(MUTED_MESSAGE_DELAY);
    } else {
      await this.audio
        .play(src, {
          muted: this.props.isMuted,
          onError: () => this.setError(),
        })
        .catch(Utils.functional.noop);
    }
  }

  private async processFlowTrace({ payload: { diagramID } }: FlowTrace) {
    if (!diagramID || !this.props.enterFlow) {
      return;
    }

    if (!this.isPublicPrototype) {
      await this.navigateToFlow(diagramID);
    }
  }

  private async processGoToTrace({ payload: { request } }: GoToTrace) {
    await this.next(request);
  }

  private processNoReplyTrace(trace: NoReplyTrace) {
    if (!trace.payload.timeout) {
      return;
    }

    // timeout is in seconds
    this.noReplyTimeout = this.timeout.set(trace.payload.timeout * 1000, () => {
      this.resetInteractions();
      this.next(null);
    });
  }

  private async navigateToFlow(diagramID: string) {
    this.props.enterFlow(diagramID);

    const currentFlowStack = this.props.flowIDHistory;
    const flowAlreadyInHistory = currentFlowStack.includes(diagramID);

    if (!flowAlreadyInHistory) {
      this.props.updatePrototype({ flowIDHistory: [...currentFlowStack, diagramID] });
    }

    await this.waitDiagram(diagramID);
    await this.waitEngineAndNodes();
    // Highlight the start block when entering a flow
    const startNode = Array.from(this.props.getEngine()?.nodes ?? []).find((data) => data[1].type === BlockType.START);
    // TODO: refactor block highlighting system, topics do not have startNodes
    let updatedActivePathBlockArray = Utils.array.unique([...this.props.activePathBlockIDs, ...(startNode ? [startNode[0]] : [])]);

    const beginningBlock = this.props.activePathBlockIDs[0];
    const beginningFlowID = this.props.flowIDHistory[0];

    // This if block handles the edge case were a user starts on a non-start block when testing, and then enters the
    // default 'help' flow. Since these diagram start blocks have the same ID, we have to dynamically add and remove
    // the, from the activePathBlockID array, so when users exit flows, the start block won't be incorrectly highlighted
    if (beginningBlock !== START_BLOCK_ID && beginningFlowID === diagramID) {
      updatedActivePathBlockArray = updatedActivePathBlockArray.filter((val) => val !== START_BLOCK_ID);
    }

    const updatePrototypeData = { activePathBlockIDs: updatedActivePathBlockArray };
    this.props.updatePrototype(updatePrototypeData);
  }

  private async processEndTrace() {
    this.props.getEngine()?.selection.reset();
    const lastNodeID = findLastBlockTrace(this.context?.trace ?? [])?.payload.blockID;
    if (lastNodeID) {
      this.props.getEngine()?.prototype.setFinalNodeID(lastNodeID);
    }
    this.props.updateStatus(PMStatus.ENDED);
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
    if (targetNode.type === BlockType.FLOW || targetNode.type === BlockType.COMPONENT) {
      const builtIn = (targetNode.ports.out.builtIn ?? {}) as Realtime.NodeData.FlowBuiltInPorts | Realtime.NodeData.ComponentBuiltInPorts;

      const outPort = builtIn[BaseModels.PortType.NEXT];
      const linksByPortID = outPort ? this.props.getLinksByPortID(outPort) : [];
      const outLinkID = linksByPortID?.[0]?.id;

      outLinkIDs = outLinkID ? [outLinkID] : [];
    }

    let activePathLinkArray = this.props.activePathLinkIDs;
    if (activePathLinkID) {
      activePathLinkArray = Utils.array.unique([...this.props.activePathLinkIDs, ...outLinkIDs, activePathLinkID]);
    }

    const updatedContextHistory = getUpdatedContextHistory(
      this.props.contextStep,
      this.props.contextHistory,
      'activePathLinkIDs',
      activePathLinkArray
    );

    this.props.updatePrototype({ activePathLinkIDs: activePathLinkArray, contextHistory: updatedContextHistory });
  }

  private focusNode(parentID: string) {
    this.props.getEngine()?.node.center(parentID);
  }

  private async waitFor(condition: () => boolean) {
    while (condition()) {
      // eslint-disable-next-line no-await-in-loop
      await this.timeout.delay(WAIT_ENTITY_TIME);
    }
  }

  private async waitNode(nodeID: string) {
    await this.waitFor(() => !!nodeID && !this.props.getEngine()?.getNodeByID(nodeID));
  }

  private async waitDiagram(diagramID: string) {
    await this.waitFor(() => this.props.activeDiagramID !== diagramID);
  }

  private async waitEngineAndNodes() {
    await this.waitFor(() => !this.props.getEngine());
  }
}

export default TraceController;
