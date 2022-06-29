import { TableTypes } from '@voiceflow/ui';
import React from 'react';

import { OrderedVariable } from '@/hooks';
import { getVariableDescription } from '@/utils/variable';

import { NameColumn } from '../../components';
import { DescriptionColumn, HeaderSelectColumn, SelectColumn, TypeColumn } from './components';

export enum TableColumn {
  NAME = 'NAME',
  TYPE = 'TYPE',
  SELECT = 'SELECT',
  DESCRIPTION = 'DESCRIPTION',
}

export const COLUMNS: TableTypes.Column<TableColumn, OrderedVariable>[] = [
  {
    type: TableColumn.SELECT,
    flex: 0,
    label: <HeaderSelectColumn />,
    component: SelectColumn,
  },

  {
    type: TableColumn.NAME,
    flex: 3,
    label: 'Name',
    width: 288,
    sorter: (slotL, slotR) => slotL.name.localeCompare(slotR.name),
    component: (props) => <NameColumn {...props} placeholder="Enter intent name" />,
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
    type: TableColumn.DESCRIPTION,
    flex: 5,
    label: 'Description',
    ellipses: true,
    component: DescriptionColumn,
    overflowTooltip: ({ item }) => ({ title: getVariableDescription(item.name) }),
  },
];
