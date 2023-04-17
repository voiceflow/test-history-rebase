import * as Realtime from '@voiceflow/realtime-sdk';
import { TableTypes } from '@voiceflow/ui';
import React from 'react';

import { HeaderSelectColumn, InputsColumn, NameColumn, SelectColumn, TypeColumn } from './components';

export enum TableColumn {
  NAME = 'NAME',
  TYPE = 'TYPE',
  SELECT = 'SELECT',
  INPUTS = 'INPUTS',
}

export const COLUMNS: TableTypes.Column<TableColumn, Realtime.Slot>[] = [
  {
    type: TableColumn.SELECT,
    flex: 0,
    label: <HeaderSelectColumn />,
    component: SelectColumn,
  },

  {
    type: TableColumn.NAME,
    flex: 3,
    width: 288,
    label: 'Name',
    sorter: (slotL, slotR) => slotL.name.localeCompare(slotR.name),
    ellipses: true,
    component: (props) => <NameColumn {...props} placeholder="Enter intent name" />,
    overflowTooltip: ({ item }) => ({ content: item.name }),
  },

  {
    type: TableColumn.TYPE,
    flex: 2,
    width: 148,
    label: 'Type',
    sorter: (slotL, slotR) => (!slotR.type || !slotL.type ? 0 : slotL.type.localeCompare(slotR.type)),
    component: TypeColumn,
  },

  {
    type: TableColumn.INPUTS,
    flex: 5,
    label: 'Values',
    ellipses: true,
    component: InputsColumn,
    overflowTooltip: ({ item }) => ({
      content: item.inputs
        .map(({ value }) => value.trim())
        .filter(Boolean)
        .join(', '),
    }),
  },
];
