import * as Realtime from '@voiceflow/realtime-sdk';
import { TableTypes, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { DOCS_BASE_LINK } from '@/config/documentation';
import { isCustomizableBuiltInIntent } from '@/utils/intent';

import { HeaderSelectColumn, NameColumn } from '../../components';
import { ClarityColumn, ConfidenceColumn, EntitiesColumn, SelectColumn, UtterancesColumn } from './components';

export enum TableColumn {
  NAME = 'NAME',
  SELECT = 'SELECT',
  CLARITY = 'CLARITY',
  ENTITIES = 'ENTITIES',
  UTTERANCES = 'UTTERANCES',
  CONFIDENCE = 'CONFIDENCE',
}

export const COLUMNS: TableTypes.Column<TableColumn, Realtime.Intent>[] = [
  {
    type: TableColumn.SELECT,
    flex: 0,
    label: <HeaderSelectColumn />,
    component: SelectColumn,
  },

  {
    type: TableColumn.NAME,
    flex: 1.5,
    label: 'Name',
    sorter: (intentL, intentR) => intentL.name.localeCompare(intentR.name),
    ellipses: true,
    component: (props) => <NameColumn {...props} placeholder="Enter intent name" />,
    overflowTooltip: ({ item }) => ({ title: item.name }),
  },

  {
    type: TableColumn.CONFIDENCE,
    flex: 1,
    label: 'Confidence',
    sorter: (intentL, intentR) => (isCustomizableBuiltInIntent(intentL) ? 1 : intentL.inputs.length - intentR.inputs.length),
    tooltip: {
      html: (
        <TippyTooltip.FooterButton onClick={() => window.open(DOCS_BASE_LINK)} buttonText="More">
          Confidence is a measure of a specific intents data robustness.
        </TippyTooltip.FooterButton>
      ),
      interactive: true,
    },
    component: ConfidenceColumn,
  },

  {
    type: TableColumn.CLARITY,
    flex: 1,
    label: 'Clarity',
    tooltip: {
      html: (
        <TippyTooltip.FooterButton onClick={() => window.open(DOCS_BASE_LINK)} buttonText="More">
          Clarity is a measure of an intents ability to be recognized, relative to the rest of your model.
        </TippyTooltip.FooterButton>
      ),
      interactive: true,
    },
    component: ClarityColumn,
  },

  {
    type: TableColumn.ENTITIES,
    flex: 2,
    label: 'Entities',
    component: EntitiesColumn,
  },

  {
    type: TableColumn.UTTERANCES,
    flex: 1,
    label: 'Utterances',
    sorter: (intentL, intentR) => intentL.inputs.length - intentR.inputs.length,
    component: UtterancesColumn,
  },
];
