import { GeneralRequest, IntentName, RequestType, TraceType } from '@voiceflow/general-types';
import { SpeakType } from '@voiceflow/general-types/build/nodes/speak';
import { TraceStreamAction } from '@voiceflow/general-types/build/nodes/stream';
import { StepData as VisualData } from '@voiceflow/general-types/build/nodes/visual';
import cuid from 'cuid';

import { GENERAL_RUNTIME_ENDPOINT, IS_TEST } from '@/config';
import { BlockType, START_BLOCK_ID } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Prototype from '@/ducks/prototype';
import { BlockTrace, ChoiceTrace, FlowTrace, Link, Node, SpeakTrace, StreamTrace, Trace, VisualTrace } from '@/models';
import type { Engine } from '@/pages/Canvas/engine';
import { tail, unique } from '@/utils/array';
import { noop } from '@/utils/functional';

import { Interaction, PMStatus } from '../types';
import AudioController from './Audio';
import MessageController from './Message';
import TimeoutController from './Timeout';
import { getUpdatedContextHistory } from './utils/activePath';

export enum StepDirection {
  FORWARD = 'forward',
  BACK = 'back',
}

export type TraceControllerProps = {
  debug: boolean;
  engine?: null | Engine;
  isMuted: boolean;
  setError: (error: string) => void;
  isPublic?: boolean;
  enterFlow: (diagramID: string) => void;
  contextStep: number;
  waitVisuals: boolean;
  getNodeByID: (targetBlockID: string) => Node;
  updateStatus: (status: PMStatus) => void;
  fetchContext: (request: GeneralRequest) => Promise<Prototype.Context | null>;
  flowIDHistory: string[];
  contextHistory: Partial<Prototype.Context>[];
  activeDiagramID: string;
  setInteractions: (interactions: Interaction[]) => void;
  updatePrototype: (payload: Partial<Prototype.PrototypeState>) => void;
  getLinksByPortID: (portID: string) => Link[];
  activePathLinkIDs: string[];
  visualDataHistory: (null | VisualData)[];
  activePathBlockIDs: string[];
  updatePrototypeVisualsData: (data: null | VisualData) => void;
  updatePrototypeVisualsDataHistory: (dataHistory: (null | VisualData)[]) => void;
};

type Options = {
  props: TraceControllerProps;
  audio: AudioController;
  message: MessageController;
  timeout: TimeoutController;
};

type StreamState = {
  src: string | null;
  token: string | null;
  offset: number;
};

const findLastBlockTrace = (trace: Trace[]) => [...trace].reverse().find((traceFrame) => traceFrame.type === TraceType.BLOCK);

const WAIT_ENTITY_TIME = 200;
const MIN_FOCUSED_NODE_TIME = 500;
const WAIT_DISPLAY_TIME = 1000;

class TraceController {
  private trace: Trace[] = [];

  private props: Options['props'];

  private audio: Options['audio'];

  private stopped = false;

  private message: Options['message'];

  private timeout: Options['timeout'];

  private context: Prototype.Context | null = null;

  private streamState: StreamState = { src: null, offset: 0, token: null };

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

  public next = async (request: GeneralRequest = null): Promise<void> => {
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
    await this.processTrace([targetBlockTraceFrame, targetStepTrace]);

    this.props.updatePrototype({ context: targetContext as Prototype.Context });
    this.props.updatePrototypeVisualsData(targetVisualData);

    this.context = {
      ...targetContext,
      trace: targetContext.trace?.map((trace: Trace) => ({ ...trace, id: cuid() })) ?? [],
    } as Prototype.Context;
  };

  public stop(): void {
    this.trace = [];
    this.stopped = true;
  }

  public async emptyTrace(): Promise<void> {
    await this.processTrace(this.trace, { onlyMessage: true });
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

    this.trace = tailTrace;

    this.props.updateStatus(PMStatus.NAVIGATING);

    if (!this.isPublicPrototype) {
      await this.waitEngineAndNodes();
    }

    switch (topTrace.type) {
      case TraceType.CHOICE: {
        this.processChoiceTrace(topTrace);
        break;
      }
      case TraceType.BLOCK: {
        await this.processBlockTrace(topTrace, { isLast: !tailTrace.length, onlyMessage });
        break;
      }
      case TraceType.STREAM: {
        await this.processStreamTrace(topTrace, { onlyMessage });
        break;
      }
      case TraceType.SPEAK: {
        await this.processSpeakTrace(topTrace, { onlyMessage });
        break;
      }
      case TraceType.FLOW: {
        await this.processFlowTrace(topTrace);
        break;
      }
      case TraceType.END: {
        await this.processEndTrace();
        break;
      }
      case TraceType.VISUAL: {
        await this.processVisual(topTrace);
        break;
      }
      case TraceType.DEBUG: {
        await this.message.debug(topTrace.id, { message: topTrace.payload.message });
        break;
      }
      default:
        console.warn('Unsupported trace found!', topTrace); // eslint-disable-line no-console
    }

    if (this.trace === tailTrace) {
      await this.processTrace(tailTrace, { onlyMessage });
    }
  }

  private processChoiceTrace({ payload: { choices } }: ChoiceTrace) {
    this.props.setInteractions(choices);
  }

  private saveActivePathBlock(node: Node) {
    const updatedActivePathBlockArray = unique([...this.props.activePathBlockIDs, node!.parentNode!]);
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
    const node = this.props.engine?.getNodeByID(trace.payload.blockID);

    if (node && !this.isPublicPrototype) {
      await this.highlightBlock(node);
    }

    if (onlyMessage || !this.props.debug) {
      return;
    }

    const isLast = this.trace.length === 1;

    if (!isLast) {
      this.props.updateStatus(PMStatus.FORCED_DELAY);
    }

    await this.timeout.set(MIN_FOCUSED_NODE_TIME);
  }

  private async processVisual(trace: VisualTrace) {
    this.props.updatePrototypeVisualsData(trace.payload);

    if (this.props.waitVisuals) {
      await this.timeout.set(WAIT_DISPLAY_TIME);
    }
  }

  private async highlightBlock(node: Node) {
    const hasParent = !!node.parentNode;

    const [, sourceNodeID] = tail(this.props.engine?.select(Prototype.activePathBlockIDsSelector) || []);

    if (hasParent) {
      this.saveActivePathBlock(node);
    }

    this.saveActivePathLink(sourceNodeID, node);

    if (hasParent) {
      this.focusNode(node.parentNode!);
    }
  }

  private async processStreamTrace(
    { id, payload: { src, action, token } }: StreamTrace,
    { onlyMessage }: { isLast?: boolean; onlyMessage?: boolean }
  ) {
    this.message.stream(id, { audio: src });

    const pausing = action === TraceStreamAction.PAUSE;

    this.props.setInteractions([{ name: 'next' }, { name: 'previous' }, { name: pausing ? 'resume' : 'pause' }]);

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

    try {
      await this.audio.play(src, {
        loop: action === TraceStreamAction.LOOP,
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

    await this.next({ type: RequestType.TEXT, payload: IntentName.NEXT });
  }

  private async processSpeakTrace({ id, payload: { src, type, voice, message } }: SpeakTrace, { onlyMessage }: { onlyMessage?: boolean } = {}) {
    if (type === SpeakType.AUDIO) {
      this.message.audio(id, { name: message, src });
    } else {
      this.message.speak(id, { message, voice, src });
    }

    if (onlyMessage) {
      return;
    }

    await this.audio.play(src, { muted: this.props.isMuted, onError: () => this.setError() }).catch(noop);
  }

  private async processFlowTrace({ payload: { diagramID } }: FlowTrace) {
    if (!diagramID || !this.props.enterFlow) {
      return;
    }

    if (!this.isPublicPrototype) {
      await this.navigateToFlow(diagramID);
    }
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
    const startNode = Array.from(this.props.engine!.nodes).find((data) => data[1].type === BlockType.START);
    const startNodeID = startNode![0];
    let updatedActivePathBlockArray = unique([...this.props.activePathBlockIDs, startNodeID]);

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
    this.props.engine?.selection.reset();
    this.props.updateStatus(PMStatus.ENDED);
  }

  private setError = (message = 'Unable to play an audio') => {
    this.props.updateStatus(PMStatus.ERROR);
    this.props.setError(message);
  };

  private findLinkBetween(sourceID: string, targetID: string): string | null {
    const source = this.props.engine?.getNodeByID(sourceID);
    const [, sourceLastChild] = tail(source?.combinedNodes ?? []);
    const sourceIDs = [sourceID, ...(sourceLastChild ? [sourceLastChild] : [])];

    const target = this.props.engine?.getNodeByID(targetID);
    const [targetFirstChild] = target?.parentNode ? this.props.engine?.getNodeByID(target.parentNode).combinedNodes ?? [] : [];
    const targetIDs = [targetID, ...(targetID === targetFirstChild ? [target!.parentNode!] : [])];

    const getJoiningLinks = this.props.engine?.select(Creator.joiningLinkIDsSelector);
    const [linkID] = sourceIDs.flatMap((id) => targetIDs.flatMap((linkTargetID) => getJoiningLinks?.(id, linkTargetID, true) ?? []));

    return linkID ?? null;
  }

  private saveActivePathLink(sourceNodeID: string, targetNode: Node) {
    const activePathLinkID = this.findLinkBetween(sourceNodeID, targetNode.id);

    let flowOutLink: string[] = [];
    // We need to prematurely highlight the out link of a node block (if it exists)
    // because the regular active path logic doesn't account for that case
    if (targetNode.type === BlockType.FLOW) {
      const outPort: string = targetNode.ports.out[0];
      const linksByPortID = this.props.getLinksByPortID(outPort);
      const flowOutLinkID = linksByPortID?.[0]?.id;
      flowOutLink = flowOutLinkID ? [flowOutLinkID] : [];
    }

    let activePathLinkArray = this.props.activePathLinkIDs;
    if (activePathLinkID) {
      activePathLinkArray = unique([...this.props.activePathLinkIDs, ...flowOutLink, activePathLinkID]);
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
    this.props.engine?.node.center(parentID);
  }

  private async waitNode(nodeID: string) {
    while (nodeID && !this.props.getNodeByID(nodeID)) {
      // eslint-disable-next-line no-await-in-loop
      await this.timeout.set(WAIT_ENTITY_TIME);
    }
  }

  private async waitDiagram(diagramID: string) {
    while (this.props.activeDiagramID !== diagramID) {
      // eslint-disable-next-line no-await-in-loop
      await this.timeout.set(WAIT_ENTITY_TIME);
    }
  }

  private async waitEngineAndNodes() {
    while (!this.props.engine?.nodes.size) {
      // eslint-disable-next-line no-await-in-loop
      await this.timeout.set(WAIT_ENTITY_TIME);
    }
  }
}

export default TraceController;
