import cuid from 'cuid';

import { NLCIntent } from '../types';
import AudioController from './Audio';
import DialogController, { DialogControllerProps } from './Dialog';
import MessageController, { MessageControllerProps } from './Message';
import TimeoutController from './Timeout';
import TraceController, { StepDirection, TraceControllerProps } from './Trace';

export type PrototypeToolProps = MessageControllerProps & TraceControllerProps & DialogControllerProps;

class PrototypeTool {
  private props: PrototypeToolProps;

  public audio?: AudioController;

  private trace?: TraceController;

  private dialog?: DialogController;

  private message?: MessageController;

  private timeout?: TimeoutController;

  constructor(props: PrototypeToolProps) {
    this.props = props;
  }

  public start() {
    this.createController();

    this.message!.trackStartTime();
    this.message!.session(cuid(), 'New session started');
    this.trace!.start();
    this.trace!.next();
  }

  public stop() {
    this.audio?.stop();
    this.trace?.stop();
    this.dialog?.stop();
    this.timeout?.clearAll();

    this.audio = undefined;
    this.trace = undefined;
    this.dialog = undefined;
    this.message = undefined;
    this.timeout = undefined;
  }

  public play(src: string) {
    const muted = this.props.engine?.getPrototypeMuted();
    this.audio?.playExternal(src, muted);
  }

  public stepBack() {
    this.trace?.historyStep(StepDirection.BACK);
  }

  public stepForward() {
    this.trace?.historyStep(StepDirection.FORWARD);
  }

  public async interact(input: string) {
    this.audio!.stop();
    await this.trace?.emptyTrace();
    this.trace?.resetInteractions();

    this.message?.user(cuid(), input);

    try {
      const intent = await this.dialog?.handle(input);

      await this.trace!.next(TraceController.getNextStateRequest(intent as NLCIntent, input));
    } catch {
      // no action, dialog may throw
    }
  }

  private createController() {
    this.audio = new AudioController();
    this.timeout = new TimeoutController();

    this.message = new MessageController({
      props: this.props,
    });

    this.dialog = new DialogController({
      props: this.props,
      audio: this.audio,
      message: this.message,
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
