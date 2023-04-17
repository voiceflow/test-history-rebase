import { TableTypes } from '@voiceflow/ui';

import { ActionsCell, DomainCell, TopicsCell } from './components';
import { Topic } from './types';

export enum TableColumn {
  TOPIC = 'TOPIC',
  INTENTS = 'INTENTS',
  ACTIONS = 'ACTIONS',
}

export const COLUMNS: TableTypes.Column<TableColumn, Topic>[] = [
  {
    type: TableColumn.TOPIC,
    flex: 1,
    label: 'Topics',
    sorter: (topicL, topicR) => topicL.name.localeCompare(topicR.name),
    ellipses: true,
    component: DomainCell,
    overflowTooltip: ({ item }) => ({ content: item.name }),
  },
  {
    type: TableColumn.INTENTS,
    flex: 1,
    width: 49,
    label: 'Intents',
    sorter: (topicL, topicR) => topicL.intents.length - topicR.intents.length,
    component: TopicsCell,
  },
  {
    type: TableColumn.ACTIONS,
    flex: 1,
    width: 35,
    label: '',
    component: ActionsCell,
  },
];

export const VIEWER_COLUMNS = COLUMNS.slice(0, -1);
