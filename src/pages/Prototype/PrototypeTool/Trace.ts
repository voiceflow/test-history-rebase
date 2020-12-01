import NLC from '@voiceflow/natural-language-commander';
import cuid from 'cuid';
import _noop from 'lodash/noop';

import { IS_TEST } from '@/config';
import { BlockType, START_BLOCK_ID } from '@/constants';
import { SpeakTraceAudioType, StreamTraceAction, TraceType } from '@/constants/prototype';
import { Context, PrototypeState } from '@/ducks/prototype';
import { BlockTrace, ChoiceTrace, EndTrace, FlowTrace, Link, Node, SpeakTrace, StateRequest, StreamTrace, Trace } from '@/models';
import type { Engine } from '@/pages/Canvas/engine';
import { unique } from '@/utils/array';

import { Interaction, NLCIntent, PMStatus, TMAmazonIntent } from '../types';
import AudioController from './Audio';
import MessageController from './Message';
import TimeoutController from './Timeout';
import { getUpdatedContextHistory, waitForFlowLoad } from './utils/activePath';
import { getNLCIntentSlotsMap, getUtteranceChoices } from './utils/intent';

export enum StepDirection {
  FORWARD = 'forward',
  BACK = 'back',
}

export type TraceControllerProps = {
  activePathLinkIDs: string[];
  activePathBlockIDs: string[];
  nlc: NLC;
  debug: boolean;
  flowIDHistory: string[];
  engine?: null | Engine;
  setError: (error: string) => void;
  enterFlow: (diagramID: string) => void;
  fetchContext: (request?: StateRequest) => Promise<Context | null>;
  updateStatus: (status: PMStatus) => void;
  setInteractions: (interactions: Interaction[]) => void;
  updatePrototype: (payload: Partial<PrototypeState>) => void;
  getLinksByPortID: (portID: string) => Link[];
  activeDiagramID: string;
  contextHistory: Partial<Context>[];
  contextStep: number;
  getNodeByID: (targetBlockID: string) => void;
  getJoiningLinks: (lhsNodeID: string, rhsNodeID: string) => Link[];
  isPublic?: boolean;
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

const ENTER_FLOW_TIME = 800;
const WAIT_FOR_ENGINE_TIME = 200;
const MIN_FOCUSED_NODE_TIME = 500;

class TraceController {
  private trace: Trace[] = [];

  private props: Options['props'];

  private audio: Options['audio'];

  private stopped = false;

  private ended = false;

  private message: Options['message'];

  private timeout: Options['timeout'];

  private context: Context | null = null;

  private streamState: StreamState = { src: null, offset: 0, token: null };

  get isPublicPrototype() {
    return !!this.props.isPublic;
  }

  public start() {
    this.ended = false;
  }

  public resetInteractions() {
    this.props.setInteractions([]);
  }

  public static getNextStateRequest(nlcIntent?: NLCIntent | null, input?: string): StateRequest {
    let intent;

    if (nlcIntent) {
      intent = {
        name: nlcIntent.intent,
        slots: getNLCIntentSlotsMap(nlcIntent),
      };
    } else {
      intent = { name: 'AMAZON.FallbackIntent' };
    }

    return {
      type: 'INTENT',
      payload: { type: 'IntentRequest', intent, input },
    };
  }

  constructor({ audio, props, message, timeout }: Options) {
    this.props = props;
    this.audio = audio;
    this.timeout = timeout;
    this.message = message;
  }

  public next = async (request?: StateRequest) => {
    const currentContextStep = this.props.contextStep;
    const contextHistory = this.props.contextHistory;
    const historyLength = contextHistory.length;

    // Remove any forward history
    if (currentContextStep !== historyLength - 1) {
      const newHistoryArray = contextHistory.slice(0, currentContextStep + 1);
      this.props.updatePrototype({ contextHistory: newHistoryArray });
    }

    this.props.updateStatus(PMStatus.FETCHING_CONTEXT);

    this.context = await this.props.fetchContext(request);

    if (this.stopped) {
      return;
    }

    if (!this.context) {
      this.setError('Unable to fetch response');
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

  public historyStep = async (direction: StepDirection) => {
    const offset = direction === StepDirection.BACK ? -1 : 1;
    const currentContextStep = this.props.contextStep;
    const newContextStepNumber = currentContextStep + offset;
    const contextHistory = this.props.contextHistory;
    const targetDiagramID =
      direction === StepDirection.BACK
        ? contextHistory[currentContextStep].previousContextDiagramID
        : contextHistory[newContextStepNumber].targetContextDiagramID;

    this.resetInteractions();

    if (targetDiagramID && this.props.activeDiagramID !== targetDiagramID) {
      // TO DO, check it on same flow, if yes, dont run this
      this.props.enterFlow?.(targetDiagramID);
      await this.timeout.set(ENTER_FLOW_TIME);
    }

    const activePathBlockIDsSnapshot = contextHistory[newContextStepNumber]?.activePathBlockIDs || [];
    const activePathLinkIDsSnapshot = contextHistory[newContextStepNumber]?.activePathLinkIDs || [];

    this.props.updatePrototype({
      contextStep: newContextStepNumber,
      activePathLinkIDs: activePathLinkIDsSnapshot,
      activePathBlockIDs: activePathBlockIDsSnapshot,
    });

    const targetContext = contextHistory[newContextStepNumber];
    const targetTrace = targetContext!.trace;
    const targetBlockTraceFrame = findLastBlockTrace(targetTrace!) as BlockTrace;
    const targetStepTrace = targetTrace![targetTrace!.length - 1];
    const targetBlockID = targetBlockTraceFrame.payload?.blockID;

    // wait for the block to render (to account for switching between flows)
    await waitForFlowLoad(targetBlockID, this.props.getNodeByID);
    await this.processTrace([targetBlockTraceFrame, targetStepTrace]);
    this.props.updatePrototype({ context: targetContext as Context });

    this.context = {
      ...targetContext,
      trace: targetContext.trace?.map((trace: Trace) => ({ ...trace, id: cuid() })) ?? [],
    } as Context;
  };

  public stop() {
    this.trace = [];
    this.stopped = true;
  }

  public async emptyTrace() {
    await this.processTrace(this.trace, { onlyMessage: true });
  }

  private async processTrace(trace: Trace[], { onlyMessage = false }: { onlyMessage?: boolean } = {}) {
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
        await this.processEndTrace(topTrace);
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
    const intents = this.props.nlc.getIntents();

    // if the choices are intent names, replace with the first utterance of that intent
    const utteranceChoices = getUtteranceChoices(choices, intents);

    this.props.setInteractions(utteranceChoices);
  }

  private saveActivePathBlock(node: Node) {
    const updatedActivePathBlockArray = unique([...this.props.activePathBlockIDs, node!.parentNode!]);
    const updatedContextHistory = getUpdatedContextHistory(
      this.props.contextStep,
      this.props.contextHistory,
      'activePathBlockIDs',
      updatedActivePathBlockArray
    );

    const updatePrototypeData = { activePathBlockIDs: updatedActivePathBlockArray, contextHistory: updatedContextHistory };

    this.props.updatePrototype(updatePrototypeData);
  }

  private async processBlockTrace(trace: BlockTrace, { onlyMessage }: { isLast?: boolean; onlyMessage?: boolean } = {}) {
    if (!this.isPublicPrototype) {
      await this.highlightBlock(trace);
    }

    if (onlyMessage || !this.props.debug) {
      return;
    }

    await this.timeout.set(MIN_FOCUSED_NODE_TIME);
  }

  private async highlightBlock({ payload: { blockID } }: BlockTrace) {
    if (!this.isPublicPrototype) {
      while (!this.props.engine) {
        // eslint-disable-next-line no-await-in-loop
        await this.timeout.set(WAIT_FOR_ENGINE_TIME);
      }
    }
    const node = this.props.engine?.getNodeByID(blockID);
    const hasParent = !!node?.parentNode;

    if (hasParent) {
      this.saveActivePathBlock(node!);
    }

    const previousNodeID = this.props.engine?.selection.getTargets()?.[0];
    const nextStepID = blockID;
    const parentID = node?.parentNode;

    this.saveActivePathLink(nextStepID, previousNodeID!, node!, parentID);

    this.focusNode(nextStepID, parentID);
  }

  private async processStreamTrace(
    { id, payload: { src, action, token } }: StreamTrace,
    { onlyMessage }: { isLast?: boolean; onlyMessage?: boolean }
  ) {
    this.message.stream(id, { audio: src });

    const pausing = action === StreamTraceAction.PAUSE;

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
    const muted = this.props.engine?.getPrototypeMuted();

    try {
      await this.audio.play(src, {
        muted,
        loop: action === StreamTraceAction.LOOP,
        offset: this.streamState.offset,
        onPause: (audio) => {
          this.streamState.offset = audio.currentTime;
        },
        onError: () => this.setError(),
      });
    } catch {
      return;
    }

    await this.next(TraceController.getNextStateRequest({ intent: TMAmazonIntent.NEXT }));
  }

  private async processSpeakTrace(
    { id, payload: { src, type, voice, message, choices } }: SpeakTrace,
    { onlyMessage }: { onlyMessage?: boolean } = {}
  ) {
    if (type === SpeakTraceAudioType.AUDIO) {
      this.message.audio(id, { name: message, src });
    } else {
      this.message.speak(id, { message, voice, src });
    }

    // For handling reprompts
    if (choices) {
      const intents = this.props.nlc.getIntents();
      const utteranceChoices = getUtteranceChoices(choices, intents);
      this.props.setInteractions(utteranceChoices);
    }

    if (onlyMessage) {
      return;
    }

    const muted = this.props.engine?.getPrototypeMuted();

    await this.audio.play(src, { muted, onError: () => this.setError() }).catch(_noop);
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
    await this.timeout.set(ENTER_FLOW_TIME);

    const currentFlowStack = this.props.flowIDHistory;
    const flowAlreadyInHistory = currentFlowStack.includes(diagramID);
    if (!flowAlreadyInHistory) {
      this.props.updatePrototype({ flowIDHistory: [...currentFlowStack, diagramID] });
    }

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

  private async processEndTrace(topTrace: EndTrace) {
    // Only show this message once (end trace can get hit multiple times, with an exit block in a flow)
    if (!this.ended) {
      this.message.session(topTrace.id, 'Session ended');
    }

    this.ended = true;
    this.props.engine?.selection.reset();
    this.props.updateStatus(PMStatus.ENDED);
  }

  private setError = (message = 'Unable to play an audio') => {
    this.props.updateStatus(PMStatus.ERROR);
    this.props.setError(message);
  };

  private saveActivePathLink(nodeID: string, previousNodeID: string, node: Node, parentID?: string | null) {
    // Combined blocks and first step IDs must be checked as the inPort
    const targetNodeIDs = [nodeID];
    if (parentID) {
      const isFirstStep = this.props.engine?.getNodeByID(parentID)?.combinedNodes[0] === nodeID;
      if (isFirstStep) {
        targetNodeIDs.push(parentID);
      }
    }

    const activePathLink: Link | undefined = targetNodeIDs.reduce<Link[]>(
      (acc, targetNodeID) => [...acc, ...this.props.getJoiningLinks(previousNodeID, targetNodeID)],
      []
    )[0];

    let flowOutLink: string[] = [];
    // We need to prematurely highlight the out link of a node block (if it exists)
    // because the regular active path logic doesn't account for that case
    if (node.type === BlockType.FLOW) {
      const outPort: string = node.ports.out[0];
      const linksByPortID = this.props.getLinksByPortID(outPort);
      const flowOutLinkID = linksByPortID?.[0]?.id;
      flowOutLink = flowOutLinkID ? [flowOutLinkID] : [];
    }

    let activePathLinkArray = this.props.activePathLinkIDs;
    if (activePathLink) {
      activePathLinkArray = unique([...this.props.activePathLinkIDs, ...flowOutLink, activePathLink.id]);
    }
    const updatedContextHistory = getUpdatedContextHistory(
      this.props.contextStep,
      this.props.contextHistory,
      'activePathLinkIDs',
      activePathLinkArray
    );

    this.props.updatePrototype({ activePathLinkIDs: activePathLinkArray, contextHistory: updatedContextHistory });
  }

  private focusNode(nodeID: string, parentID?: string | null) {
    this.props.engine?.selection.replace([nodeID]);

    if (parentID) {
      this.props.engine?.node.center(parentID);
    }
  }
}

export default TraceController;
