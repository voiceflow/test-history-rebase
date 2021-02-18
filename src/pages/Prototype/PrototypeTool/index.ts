import { GeneralRequest, RequestType, TextRequest } from '@voiceflow/general-types';
import cuid from 'cuid';
import _ from 'lodash';

import AudioController from './Audio';
import MessageController, { MessageControllerProps } from './Message';
import TimeoutController from './Timeout';
import TraceController, { StepDirection, TraceControllerProps } from './Trace';

export type PrototypeToolProps = MessageControllerProps & TraceControllerProps;

class PrototypeTool {
  private props: PrototypeToolProps;

  public audio?: AudioController;

  private trace?: TraceController;

  private message?: MessageController;

  private timeout?: TimeoutController;

  constructor(props: PrototypeToolProps) {
    this.props = props;
  }

  public start() {
    this.createController();

    this.message!.trackStartTime();
    this.message!.session(cuid(), 'New session started');
    this.trace!.next();
  }

  public stop() {
    this.audio?.stop();
    this.trace?.stop();
    this.timeout?.clearAll();

    this.audio = undefined;
    this.trace = undefined;
    this.message = undefined;
    this.timeout = undefined;
  }

  public play(src: string) {
    this.audio?.playExternal(src, this.props.isMuted);
  }

  public stepBack() {
    this.trace?.historyStep(StepDirection.BACK);
  }

  public stepForward() {
    this.trace?.historyStep(StepDirection.FORWARD);
  }

  public async interact(request: GeneralRequest | string = null) {
    this.audio!.stop();

    await this.trace?.emptyTrace();

    this.trace?.resetInteractions();

    const formattedRequest = _.isString(request) ? ({ type: RequestType.TEXT, payload: request } as TextRequest) : request;

    const input = formattedRequest?.type === RequestType.TEXT ? formattedRequest?.payload : JSON.stringify(formattedRequest?.payload, null, 2);

    this.message?.user(cuid(), input);

    await this.trace?.next(formattedRequest);
  }

  private createController() {
    this.audio = new AudioController();

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
