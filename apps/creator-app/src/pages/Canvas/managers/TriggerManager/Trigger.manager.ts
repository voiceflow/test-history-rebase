import { TriggerNodeItemType } from '@voiceflow/dtos';
import type * as Realtime from '@voiceflow/realtime-sdk';

import { Designer } from '@/ducks';

import type { NodeManagerConfigV3 } from '../types';
import { TriggerChip } from './Trigger.chip';
import { TriggerStep } from './Trigger.step';
import { TriggerEditor } from './TriggerEditor/Trigger.editor';
import { TRIGGER_NODE_CONFIG } from './TriggerManager.constants';

export const TriggerManager: NodeManagerConfigV3<Realtime.NodeData.Trigger> = {
  ...TRIGGER_NODE_CONFIG,
  label: 'Trigger',

  step: TriggerStep,
  chip: TriggerChip,
  editorV3: TriggerEditor,

  searchIcon: 'goToBlock',
  getSearchParams: (data, state) => {
    const intentIDs = data.items
      .filter((item) => item.type === TriggerNodeItemType.INTENT && item.resourceID)
      .map((item) => item.resourceID!);
    const intentNames = intentIDs.map((id) => Designer.Intent.selectors.nameByID(state, { id }));

    return intentNames.filter((name): name is string => !!name);
  },
};
