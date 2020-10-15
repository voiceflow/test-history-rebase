import NLC from '@voiceflow/natural-language-commander';
import _noop from 'lodash/noop';

import { IS_TEST } from '@/config';
import {
  BlockTrace,
  ChoiceTrace,
  Context,
  EndTrace,
  FlowTrace,
  SpeakTrace,
  SpeakTraceAudioType,
  StreamTrace,
  StreamTraceAction,
  Trace,
  TraceType,
} from '@/ducks/prototype';
import type { Engine } from '@/pages/Canvas/engine';

import { Interaction, NLCIntent, PMStatus, TMAmazonIntent } from '../types';
import AudioController from './Audio';
import MessageController from './Message';
import TimeoutController from './Timeout';
import { getNLCIntentSlotsMap } from './utils/intent';

export type TraceControllerProps = {
  nlc: NLC;
  debug: boolean;
  engine?: null | Engine;
  setError: (error: string) => void;
  enterFlow?: (diagramID: string) => void;
  fetchContext: (request?: any) => Promise<Context | null>;
  updateStatus: (status: PMStatus) => void;
  setInteractions: (interactions: Interaction[]) => void;
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

const ENTER_FLOW_TIME = 800;
const MIN_FOCUSED_NODE_TIME = 500;

class TraceController {
  private trace: Trace[] = [];

  private props: Options['props'];

  private audio: Options['audio'];

  private stopped = false;

  private message: Options['message'];

  private timeout: Options['timeout'];

  private context: Context | null = null;

  private streamState: StreamState = { src: null, offset: 0, token: null };

  public resetInteractions() {
    this.props.setInteractions([]);
  }

  public static getNextStateRequest(nlcIntent?: NLCIntent | null, input?: string) {
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

  public next = async (request?: any) => {
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
    const utteranceChoices = choices.map((choice) => {
      const intent = intents.find(({ intent: name }) => name === choice.name);

      const noSlotUtterances = intent?.utterances?.filter((utterance) => !utterance.match(/{\w{1,32}}/g));
      if (noSlotUtterances?.length) {
        return { name: noSlotUtterances[0] };
      }

      return choice;
    });

    this.props.setInteractions(utteranceChoices);
  }

  private async processBlockTrace({ payload: { blockID } }: BlockTrace, { onlyMessage }: { isLast?: boolean; onlyMessage?: boolean } = {}) {
    this.focusNode(blockID);

    if (onlyMessage || !this.props.debug) {
      return;
    }

    await this.timeout.set(MIN_FOCUSED_NODE_TIME);
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

  private async processSpeakTrace({ id, payload: { src, type, voice, message } }: SpeakTrace, { onlyMessage }: { onlyMessage?: boolean } = {}) {
    if (type === SpeakTraceAudioType.AUDIO) {
      this.message.audio(id, { name: message, src });
    } else {
      this.message.speak(id, { message, voice, src });
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

    await this.props.enterFlow(diagramID);
    await this.timeout.set(ENTER_FLOW_TIME);
  }

  private async processEndTrace(topTrace: EndTrace) {
    this.message.session(topTrace.id, 'Session ended');

    this.stop();

    this.props.updateStatus(PMStatus.ENDED);
  }

  private setError = (message = 'Unable to play an audio') => {
    this.props.updateStatus(PMStatus.ERROR);
    this.props.setError(message);
  };

  private focusNode(nodeID: string) {
    this.props.engine?.selection.replace([nodeID]);
    this.props.engine?.node.center(nodeID);
  }
}

export default TraceController;
