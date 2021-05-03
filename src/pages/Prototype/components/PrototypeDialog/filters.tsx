import { useSelector } from 'react-redux';

import * as Prototype from '@/ducks/prototype';
import * as Recent from '@/ducks/recent';
import { useDebug, usePublic } from '@/pages/Prototype/hooks';

import { Message, MessageType } from '../../types';

type Filter = (message: Message) => boolean;

const VisualFilter = (): Filter => {
  const mode = useSelector(Prototype.activePrototypeModeSelector);

  return () => mode !== Prototype.PrototypeMode.DISPLAY;
};

const DebugFilter = (): Filter => {
  const settings = useSelector(Recent.recentPrototypeSelector);
  const isPublic = usePublic();
  const debugEnabled = useDebug();

  return (message: Message) => {
    if (message.type !== MessageType.DEBUG) return true;

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

const filterMap: Record<string, () => Filter> = {
  [MessageType.VISUAL]: VisualFilter,
  [MessageType.DEBUG]: DebugFilter,
};

const useMessageFilters = (messages: Message[]): Message[] => {
  const filters = Object.keys(filterMap).reduce<Record<string, Filter>>((acc, type) => {
    acc[type] = filterMap[type]();
    return acc;
  }, {});

  return messages.filter((message) => filters[message.type]?.(message) ?? true);
};

export default useMessageFilters;
