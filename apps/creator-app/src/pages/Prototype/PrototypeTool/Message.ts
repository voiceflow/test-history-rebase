import { Nullable } from '@voiceflow/base-types';
import { RequestType } from '@voiceflow/dtos';
import dayjs from 'dayjs';

import { CardV2Trace, CarouselTrace, ChannelActionTrace, DebugTrace, SpeakTrace, StreamTrace, TextTrace, VisualTrace } from '@/models';

import { Message } from '../types';
import {
  createCardMessage,
  createCarouselMessage,
  createChannelActionMessage,
  createDebugMessage,
  createSessionMessage,
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

  public session(trace: { message: string }): void {
    this.add(createSessionMessage(trace, this.messageProperties()));
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
    this.add(createVisualMessage(trace, this.messageProperties()));
  }

  public carousel(trace: CarouselTrace): void {
    this.add(createCarouselMessage(trace, this.messageProperties()));
  }

  public card(trace: CardV2Trace): void {
    this.add(createCardMessage(trace, this.messageProperties()));
  }

  public channelAction(trace: ChannelActionTrace): void {
    this.add(createChannelActionMessage(trace, this.messageProperties()));
  }

  public user({ id, input }: { id?: string; input: string }): void {
    this.add(createUserMessage({ type: RequestType.TEXT, payload: input }, this.messageProperties(), id));
  }

  private add(message: Nullable<Message>): void {
    if (message) {
      this.props.addToMessages(message);
    }
  }

  private messageProperties() {
    return {
      startTime: this.getFormattedStartTime(),
    };
  }

  private getFormattedStartTime() {
    return dayjs
      .unix(0)
      .add(Date.now() - this.startTime!, 'ms')
      .format('mm:ss');
  }
}

export default MessageController;
