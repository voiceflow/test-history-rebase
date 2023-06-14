import { createColumnHelper } from '@tanstack/react-table';
import { TableTypes } from '@voiceflow/ui';
import React from 'react';

import { IdColumn, IdTooltipColumn, ImageColumn, NameColumn, NameTooltipColumn } from './components';
import { TableColumn, TableItem } from './types';

const columnHelper = createColumnHelper<TableItem>();

export const REACT_TABLE_COLUMNS = [
  columnHelper.accessor('id', {
    cell: (info) => <IdTooltipColumn id={info.getValue()} />,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'Name',
    cell: (info) => <NameTooltipColumn name={info.getValue()} />,
    header: () => <span>Full name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('image', {
    header: () => 'Image',
    cell: (info) => <ImageColumn url={info.getValue()} context={info} />,
    footer: (info) => info.column.id,
  }),
];

export const COLUMNS: TableTypes.Column<TableColumn, TableItem>[] = [
  {
    type: TableColumn.ID,
    flex: 1,
    label: 'id',
    ellipses: true,
    component: ({ item }) => <IdColumn id={item.id} />,
  },
  {
    type: TableColumn.IMAGE,
    flex: 1,
    label: 'image',
    ellipses: true,
    component: ({ item }) => <ImageColumn url={item.image} context={info} />,
  },
  {
    type: TableColumn.NAME,
    flex: 1,
    label: 'name',
    ellipses: true,
    component: ({ item }) => <NameColumn name={item.name} />,
  },
];
