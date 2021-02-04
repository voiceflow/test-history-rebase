import moment from 'moment';

import { Message, MessageType, TypedMessage } from '../types';

export type MessageControllerProps = {
  addToMessages: (message: Message) => void;
};

class MessageController {
  private props: MessageControllerProps;

  private startTime: number | null = null;

  constructor({ props }: { props: MessageControllerProps }) {
    this.props = props;
  }

  public trackStartTime(): void {
    this.startTime = Date.now();
  }

  public session(id: string, message: string): void {
    this.add({ id, type: MessageType.SESSION, message } as TypedMessage<MessageType.SESSION>);
  }

  public stream(id: string, data: Omit<TypedMessage<MessageType.STREAM>, 'id' | 'type' | 'startTime'>): void {
    this.add({ id, type: MessageType.STREAM, ...data } as TypedMessage<MessageType.STREAM>);
  }

  public speak(id: string, data: Omit<TypedMessage<MessageType.SPEAK>, 'id' | 'type' | 'startTime'>): void {
    this.add({ id, type: MessageType.SPEAK, ...data });
  }

  public audio(id: string, data: Omit<TypedMessage<MessageType.AUDIO>, 'id' | 'type' | 'startTime'>): void {
    this.add({ id, type: MessageType.AUDIO, ...data });
  }

  public debug(id: string, data: Omit<TypedMessage<MessageType.DEBUG>, 'id' | 'type' | 'startTime'>): void {
    this.add({ id, type: MessageType.DEBUG, ...data });
  }

  public user(id: string, input: string): void {
    this.add({ id, type: MessageType.USER, input } as TypedMessage<MessageType.USER>);
  }

  private add(message: Omit<Message, 'startTime'>): void {
    this.props.addToMessages({ ...message, startTime: this.getFormattedStartTime() } as Message);
  }

  private getFormattedStartTime() {
    return moment
      .unix(0)
      .add(Date.now() - this.startTime!, 'ms')
      .format('mm:ss');
  }
}

export default MessageController;
