import * as Realtime from '@voiceflow/realtime-sdk';

import { InteractionModelTabType } from '@/constants';
import { Variable } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/types';

import { ConfidenceTooltip } from './headerTooltips';

export const IntentTableColumns = {
  name: 'Name',
  confidence: 'Confidence',
  utterances: 'Utterances',
  entities: 'Entities',
};

export const EntityTableColumns = {
  name: 'Name',
  type: 'Type',
  values: 'Values',
};

export const VariablesTableColumns = {
  name: 'Name',
  type: 'Type',
  description: 'Description',
};

export const TableMeta = {
  [InteractionModelTabType.INTENTS]: {
    columns: [
      {
        name: IntentTableColumns.name,
        flexWidth: 3,
      },
      {
        name: IntentTableColumns.confidence,
        flexWidth: 3,
        Tooltip: ConfidenceTooltip,
      },
      {
        name: IntentTableColumns.utterances,
        flexWidth: 2,
      },
      {
        name: IntentTableColumns.entities,
        flexWidth: 2,
      },
    ],
  },
  [InteractionModelTabType.SLOTS]: {
    columns: [
      {
        name: EntityTableColumns.name,
        flexWidth: 3,
      },
      {
        name: EntityTableColumns.type,
        flexWidth: 2,
      },
      {
        name: EntityTableColumns.values,
        flexWidth: 5,
      },
    ],
  },
  [InteractionModelTabType.VARIABLES]: {
    columns: [
      {
        name: VariablesTableColumns.name,
        flexWidth: 3,
      },
      {
        name: VariablesTableColumns.type,
        flexWidth: 2,
      },
      {
        name: VariablesTableColumns.description,
        flexWidth: 5,
      },
    ],
  },
};

export const TableSorters = {
  [InteractionModelTabType.INTENTS]: {
    [IntentTableColumns.name]: (intentA: Realtime.Intent, intentB: Realtime.Intent) => intentA.name.localeCompare(intentB.name),
    [IntentTableColumns.confidence]: (intentA: Realtime.Intent, intentB: Realtime.Intent) => intentA.inputs.length - intentB.inputs.length,
    [IntentTableColumns.utterances]: (intentA: Realtime.Intent, intentB: Realtime.Intent) => intentA.inputs.length - intentB.inputs.length,
  },
  [InteractionModelTabType.SLOTS]: {
    [EntityTableColumns.name]: (slotA: Realtime.Intent, slotB: Realtime.Intent) => slotA.name.localeCompare(slotB.name),
    [EntityTableColumns.type]: (slotA: Realtime.Slot, slotB: Realtime.Slot) => (slotA.type || '').localeCompare(slotB.type || ''),
  },
  [InteractionModelTabType.VARIABLES]: {
    [VariablesTableColumns.name]: (variableA: Variable, variableB: Variable) => variableA.name.localeCompare(variableB.name),
    [VariablesTableColumns.type]: (variableA: Variable, variableB: Variable) => variableA.type.localeCompare(variableB.type),
  },
};
