import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { TableTypes } from '@voiceflow/ui';
import dayjs from 'dayjs';

import { ActionsCell, DomainCell, ModifiedCell, StatusCell, TopicsCell } from './components';

export enum TableColumn {
  DOMAIN = 'DOMAIN',
  STATUS = 'STATUS',
  MODIFIED = 'MODIFIED',
  TOPICS = 'TOPICS',
  ACTIONS = 'ACTIONS',
}

export const COLUMNS: TableTypes.Column<TableColumn, Realtime.Domain>[] = [
  {
    type: TableColumn.DOMAIN,
    flex: 1,

    label: 'Domains',
    sorter: (domainL, domainR) => domainL.name.localeCompare(domainR.name),
    ellipses: true,
    component: DomainCell,
    overflowTooltip: ({ item }) => ({ content: item.name }),
  },
  {
    type: TableColumn.STATUS,
    flex: 1,
    width: 102,
    label: 'Status',
    sorter: (domainL, domainR) =>
      (domainL.status ?? BaseModels.Version.DomainStatus.DESIGN).localeCompare(domainR.status ?? BaseModels.Version.DomainStatus.DESIGN) ?? 0,
    component: StatusCell,
  },
  {
    type: TableColumn.MODIFIED,
    flex: 1,
    width: 116,
    label: 'Modified',
    sorter: (domainL, domainR) => dayjs(domainR.updatedAt).diff(dayjs(domainL.updatedAt)),
    ellipses: true,
    component: ModifiedCell,
  },
  {
    type: TableColumn.TOPICS,
    flex: 1,
    width: 49,
    label: 'Topics',
    sorter: (domainL, domainR) => domainL.topicIDs.length - domainR.topicIDs.length,
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
