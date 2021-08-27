import { Request } from '@voiceflow/base-types';
import cuid from 'cuid';
import _isString from 'lodash/isString';

import AudioController from './Audio';
import MessageController, { MessageControllerProps } from './Message';
import TimeoutController from './Timeout';
import TraceController, { StepDirection, TraceControllerProps } from './Trace';

export type PrototypeToolProps = MessageControllerProps & TraceControllerProps;

class PrototypeTool {
  public audio: AudioController = new AudioController();

  private props: PrototypeToolProps;

  private trace?: TraceController;

  private message?: MessageController;

  private timeout?: TimeoutController;

  constructor(props: PrototypeToolProps) {
    this.props = props;
  }

  public start(): void {
    this.createController();

    this.message?.trackStartTime();
    this.message?.session({ id: cuid(), message: 'New session started' });
    this.trace?.next();
  }

  public stop(): void {
    this.audio?.stop();
    this.trace?.stop();
    this.timeout?.clearAll();

    this.audio = new AudioController();

    this.trace = undefined;
    this.message = undefined;
    this.timeout = undefined;
  }

  public play(src: string): void {
    this.audio?.playExternal(src, this.props.isMuted);
  }

  public stepBack(): void {
    this.trace?.historyStep(StepDirection.BACK);
  }

  public stepForward(): void {
    this.trace?.historyStep(StepDirection.FORWARD);
  }

  public async interact({ name, request = null }: { name?: string; request?: Request.BaseRequest | string | null } = {}): Promise<void> {
    this.audio?.stop();

    await this.trace?.emptyTrace();

    const isActionRequest = request && !_isString(request) && Request.isActionRequest(request);

    if (!isActionRequest) {
      this.trace?.resetInteractions();
    }

    const formattedRequest = _isString(request) ? { type: Request.RequestType.TEXT, payload: request } : request;

    if (isActionRequest) {
      this.props.fetchContext(formattedRequest);

      return;
    }

    let input = name || `[Action] ${formattedRequest?.type}`;

    if (formattedRequest && Request.isTextRequest(formattedRequest) && _isString(formattedRequest.payload)) {
      input = formattedRequest.payload;
    } else if (formattedRequest && Request.isIntentRequest(formattedRequest)) {
      input = formattedRequest.payload.query;
    }

    this.message?.user(input);

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
      message: this.message,
      timeout: this.timeout,
    });
  }
}

export default PrototypeTool;
