import { Utils } from '@voiceflow/common';
import { TableTypes } from '@voiceflow/ui';
import React from 'react';

import { ActionRow, DomainRow, StatusRow, TopicRow } from './components';
import * as S from './styles';
import { Domain } from './types';

export enum TableColumn {
  DOMAIN = 'DOMAIN',
  STATUS = 'STATUS',
  MODIFIED = 'MODIFIED',
  TOPICS = 'TOPICS',
  ACTIONS = 'ACTIONS',
}

export const COLUMNS: TableTypes.Column<TableColumn, Domain>[] = [
  {
    type: TableColumn.DOMAIN,
    flex: 1,

    label: 'Domains',
    ellipses: true,
    component: (props) => <DomainRow item={props.item} />,
    overflowTooltip: ({ item }) => ({ title: item.name }),
  },
  {
    type: TableColumn.STATUS,
    flex: 1,
    width: 102,
    label: 'Status',
    ellipses: true,
    component: ({ item }) => <StatusRow item={item} />,
  },
  {
    type: TableColumn.MODIFIED,
    flex: 1,
    width: 116,
    label: 'Modified',
    sorter: (domainL, domainR) => domainR.modified - domainL.modified,
    ellipses: true,
    component: (props) => <S.Cell>{Utils.time.getTimeDuration(props.item.modified)} ago</S.Cell>,
  },
  {
    type: TableColumn.TOPICS,
    flex: 1,
    width: 49,
    label: 'Topics',
    component: (props) => <TopicRow item={props.item} />,
  },
  {
    type: TableColumn.ACTIONS,
    flex: 1,
    width: 35,
    label: '',
    component: (props) => <ActionRow item={props.item} />,
  },
];
