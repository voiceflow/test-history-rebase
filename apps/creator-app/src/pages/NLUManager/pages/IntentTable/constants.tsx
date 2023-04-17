import { TableTypes, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { NLU_MANAGEMENT_INTENT_CLARITY, NLU_MANAGEMENT_INTENT_CONFIDENCE } from '@/config/documentation';
import { NLUIntent } from '@/pages/NLUManager/types';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

import { ClarityColumn, ConfidenceColumn, EntitiesColumn, HeaderSelectColumn, NameColumn, SelectColumn, UtterancesColumn } from './components';

export enum TableColumn {
  NAME = 'NAME',
  SELECT = 'SELECT',
  CLARITY = 'CLARITY',
  ENTITIES = 'ENTITIES',
  UTTERANCES = 'UTTERANCES',
  CONFIDENCE = 'CONFIDENCE',
}

export const COLUMNS: TableTypes.Column<TableColumn, NLUIntent>[] = [
  {
    type: TableColumn.SELECT,
    flex: 0,
    label: <HeaderSelectColumn />,
    component: SelectColumn,
  },

  {
    type: TableColumn.NAME,
    flex: 1,
    width: 288,
    label: 'Name',
    sorter: (intentL, intentR) => intentL.name.localeCompare(intentR.name),
    ellipses: true,
    component: (props) => <NameColumn {...props} placeholder="Enter intent name" />,
    overflowTooltip: ({ item }) => ({ content: item.name }),
  },

  {
    type: TableColumn.CONFIDENCE,
    flex: 1,
    width: 148,
    label: 'Confidence',
    sorter: (intentL, intentR) => intentL.confidence - intentR.confidence,
    tooltip: {
      width: 232,
      content: (
        <TippyTooltip.FooterButton onClick={onOpenInternalURLInANewTabFactory(NLU_MANAGEMENT_INTENT_CONFIDENCE)} buttonText="More">
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
    width: 160,
    label: 'Clarity',
    sorter: (intentL, intentR) => intentL.clarity - intentR.clarity,
    tooltip: {
      width: 232,
      content: (
        <TippyTooltip.FooterButton onClick={onOpenInternalURLInANewTabFactory(NLU_MANAGEMENT_INTENT_CLARITY)} buttonText="More">
          Clarity is a measure of an intents ability to be recognized, relative to the rest of your model.
        </TippyTooltip.FooterButton>
      ),
      interactive: true,
    },
    component: ClarityColumn,
  },

  {
    type: TableColumn.UTTERANCES,
    flex: 1,
    width: 108,
    label: 'Utterances',
    sorter: (intentL, intentR) => intentL.inputs.length - intentR.inputs.length,
    component: UtterancesColumn,
  },

  {
    type: TableColumn.ENTITIES,
    flex: 1,
    label: 'Entities',
    component: EntitiesColumn,
  },
];
