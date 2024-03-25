import { useSelector } from 'react-redux';

import * as Recent from '@/ducks/recent';
import { useDebug, usePublic } from '@/pages/Prototype/hooks';

import { Message, MessageType, TranscriptMessageType } from '../../types';

type Filter = (message: Message) => boolean;

const DebugFilter = (): Filter => {
  const settings = useSelector(Recent.recentPrototypeSelector);
  const isPublic = usePublic();
  const debugEnabled = useDebug();

  return (message: Message) => {
    if (message.type !== MessageType.DEBUG) return true;
    if (!message.message) return false;

    if (message.message.startsWith('matched intent')) {
      if (!settings.intent || isPublic) {
        return false;
      }
    } else if (!debugEnabled) {
      return false;
    }

    return true;
  };
};

const BlockFilter = (): Filter => {
  return (message: Message) => {
    const messageType = String(message.type);

    return messageType !== TranscriptMessageType.BLOCK && messageType !== TranscriptMessageType.CHOICE;
  };
};

const filterMap: Record<string, () => Filter> = {
  [MessageType.DEBUG]: DebugFilter,
  [TranscriptMessageType.BLOCK]: BlockFilter,
};

const useMessageFilters = (messages: Message[], messageFilter?: (messages: Message[]) => Message[]): Message[] => {
  if (messageFilter) return messageFilter(messages);
  const filters = Object.keys(filterMap).reduce<Record<string, Filter>>((acc, type) => {
    acc[type] = filterMap[type]();
    return acc;
  }, {});

  return messages.filter((message) => filters[message.type]?.(message) ?? true);
};
export default useMessageFilters;
