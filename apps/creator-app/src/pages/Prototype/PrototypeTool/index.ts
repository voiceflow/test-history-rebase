import { BaseNode, BaseTrace } from '@voiceflow/base-types';
import type { BaseRequest } from '@voiceflow/dtos';
import { RequestType } from '@voiceflow/dtos';
import { isActionRequest, isIntentRequest, isTextRequest } from '@voiceflow/utils-designer';
// eslint-disable-next-line you-dont-need-lodash-underscore/is-string
import _isString from 'lodash/isString';

import { isDebug } from '@/config';
import logger from '@/utils/logger';

import AudioController from './Audio';
import type { MessageControllerProps } from './Message';
import MessageController from './Message';
import TimeoutController from './Timeout';
import type { TraceControllerProps } from './Trace';
import TraceController, { StepDirection } from './Trace';

export type PrototypeToolProps = MessageControllerProps & TraceControllerProps;

declare global {
  interface Window {
    vf_prototypeTool?: PrototypeTool | null;
  }
}

class PrototypeTool {
  public audio: AudioController = new AudioController();

  private logger = logger.child('prototypeTool');

  private props: PrototypeToolProps;

  private trace?: TraceController;

  private message?: MessageController;

  private timeout?: TimeoutController;

  constructor(props: PrototypeToolProps) {
    this.props = props;

    if (isDebug()) {
      window.vf_prototypeTool = this;
    }
  }

  public teardown(): void {
    window.vf_prototypeTool = null;

    this.stop();
  }

  public start(): void {
    this.createController();

    this.message?.trackStartTime();
    this.message?.session({ message: 'New session started' });
    this.trace?.start();
    this.trace?.next();
  }

  public stop(): void {
    this.audio?.stop();
    this.trace?.stop();
    this.timeout?.clearAll();

    this.trace = undefined;
    this.message = undefined;
    this.timeout = undefined;
  }

  public pause(): void {
    this.audio?.pause();
  }

  public continue(): void {
    // can't continue if the stream paused
    if (
      this.trace?.topTrace?.type === BaseTrace.TraceType.STREAM &&
      this.trace.topTrace.payload.action === BaseNode.Stream.TraceStreamAction.PAUSE
    )
      return;

    this.audio?.continue();
  }

  public stepBack(): void {
    this.trace?.historyStep(StepDirection.BACK);
  }

  public stepForward(): void {
    this.trace?.historyStep(StepDirection.FORWARD);
  }

  public navigateToStep(messageID: string) {
    return this.trace?.navigateToStep(messageID);
  }

  public async interact({
    name,
    request = null,
  }: { name?: string; request?: BaseRequest | string | null } = {}): Promise<void> {
    this.audio?.stop();

    await this.trace?.flushTrace();

    const requestIsAction = isActionRequest(request);

    if (!requestIsAction) {
      this.trace?.resetInteractions();
    }

    const formattedRequest = _isString(request) ? { type: RequestType.TEXT, payload: request } : request;

    if (requestIsAction) {
      this.props.fetchContext(formattedRequest);

      return;
    }

    let input = name || `[Action] ${formattedRequest?.type}`;

    if (formattedRequest && isTextRequest(formattedRequest)) {
      input = formattedRequest.payload;
    } else if (formattedRequest && isIntentRequest(formattedRequest)) {
      input = formattedRequest.payload.query || formattedRequest.payload.intent.name;
    }

    this.message?.user({ input });

    await this.trace?.next(formattedRequest);
  }

  private createController(): void {
    this.timeout = new TimeoutController();

    this.message = new MessageController({
      props: this.props,
    });

    this.trace = new TraceController({
      props: this.props,
      audio: this.audio,
      logger: this.logger.child('trace'),
      message: this.message,
      timeout: this.timeout,
    });
  }
}

export default PrototypeTool;
