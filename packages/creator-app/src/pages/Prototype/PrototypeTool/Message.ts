import { Request } from '@voiceflow/base-types';
import moment from 'moment';

import { DebugTrace, SpeakTrace, StreamTrace, TextTrace, VisualTrace } from '@/models';

import { Message, MessageType, TypedMessage } from '../types';
import {
  createDebugMessage,
  createSpeakMessage,
  createStreamMessage,
  createTextMessage,
  createUserMessage,
  createVisualMessage,
} from './utils/message';

export interface MessageControllerProps {
  addToMessages: (message: Message) => void;
}

class MessageController {
  private props: MessageControllerProps;

  private startTime: number | null = null;

  constructor({ props }: { props: MessageControllerProps }) {
    this.props = props;
  }

  public trackStartTime(): void {
    this.startTime = Date.now();
  }

  public session({ id, message }: { id: string; message: string }): void {
    this.add({ id, type: MessageType.SESSION, message } as TypedMessage<MessageType.SESSION>);
  }

  public stream(trace: StreamTrace): void {
    this.add(createStreamMessage(trace, this.messageProperties()));
  }

  public speak(trace: SpeakTrace): void {
    this.add(createSpeakMessage(trace, this.messageProperties()));
  }

  public debug(trace: DebugTrace): void {
    this.add(createDebugMessage(trace, this.messageProperties()));
  }

  public text(trace: TextTrace): void {
    this.add(createTextMessage(trace, this.messageProperties()));
  }

  public visual(trace: VisualTrace): void {
    const message = createVisualMessage(trace, this.messageProperties());
    if (message) {
      this.add(message);
    }
  }

  public user(input: string): void {
    this.add(createUserMessage({ type: Request.RequestType.TEXT, payload: input }, this.messageProperties()));
  }

  private add(message: Message): void {
    this.props.addToMessages(message);
  }

  private messageProperties() {
    return {
      startTime: this.getFormattedStartTime(),
    };
  }

  private getFormattedStartTime() {
    return moment
      .unix(0)
      .add(Date.now() - this.startTime!, 'ms')
      .format('mm:ss');
  }
}

export default MessageController;
