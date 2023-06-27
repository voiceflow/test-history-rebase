import { BaseModels } from '@voiceflow/base-types';
import { SvgIcon, TableTypes, Text, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';

import { KnowledgeBaseTableItem } from '../context';
import { HeaderSelectColumn, SelectColumn } from './components';

export enum TableColumn {
  SELECT = 'SELECT',
  NAME = 'NAME',
  TYPE = 'TYPE',
  DATE = 'DATE',
  STATUS = 'STATUS',
}

const Status: React.FC<{ item: KnowledgeBaseTableItem }> = ({ item }) => {
  switch (item.status.type) {
    case BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS:
      return (
        <TippyTooltip content="Successfully added to Knowledge Base">
          <Text color={ThemeColor.GREEN}>
            <SvgIcon icon="checkSquare" />
          </Text>
        </TippyTooltip>
      );
    case BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR:
      if (!item.status.data) {
        return (
          <TippyTooltip content="Processing file failed">
            <Text color={ThemeColor.RED}>
              <SvgIcon icon="warning" />
            </Text>
          </TippyTooltip>
        );
      }

      return (
        <TippyTooltip
          content={
            <>
              <b>Processing file failed:</b>
              <br />
              {item.status.data}
            </>
          }
        >
          <Text color={ThemeColor.RED}>
            <SvgIcon icon="warning" />
          </Text>
        </TippyTooltip>
      );
    case BaseModels.Project.KnowledgeBaseDocumentStatus.INITIALIZED:
    case BaseModels.Project.KnowledgeBaseDocumentStatus.PENDING:
    default:
      return (
        <TippyTooltip content="Processing vectors">
          <SvgIcon icon="arrowSpin" spin variant={SvgIcon.Variant.TERTIARY} />
        </TippyTooltip>
      );
  }
};

export const COLUMNS: TableTypes.Column<TableColumn, KnowledgeBaseTableItem>[] = [
  {
    type: TableColumn.SELECT,
    flex: 0,
    label: <HeaderSelectColumn />,
    component: SelectColumn,
  },
  {
    type: TableColumn.NAME,
    flex: 0.6,
    label: 'Name',
    sorter: (l, r) => l.data.name.localeCompare(r.data.name),
    component: ({ item }) => <>{item.data.name}</>,
    ellipses: true,
    overflowTooltip: ({ item }) => ({
      content: <div style={{ wordBreak: 'break-all' }}>{item.data.name}</div>,
    }),
  },
  {
    type: TableColumn.TYPE,
    width: 60,
    flex: 0,
    label: 'Type',
    sorter: (l, r) => l.data.type.localeCompare(r.data.type),
    component: ({ item }) => <Text color={ThemeColor.SECONDARY}>{item.data.type.toUpperCase()}</Text>,
  },
  {
    type: TableColumn.STATUS,
    flex: 0,
    width: 60,
    label: 'Status',
    component: Status,
  },
  {
    type: TableColumn.DATE,
    width: 140,
    flex: 0,
    label: 'Date',
    sorter: (l, r) => l.updatedAt.getTime() - r.updatedAt.getTime(),
    component: ({ item }) => <>{dayjs(item.updatedAt).fromNow()}</>,
  },
];
