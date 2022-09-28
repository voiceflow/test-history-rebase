import { LimitType } from '@/config/planLimitV2';
import * as VariableState from '@/ducks/variableState';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import * as ModalsV2 from '@/ModalsV2';

import { usePlanLimitedAction } from './planLimitV2';
import { useSelector } from './redux';

export const useCreateVariableState = (): VoidFunction => {
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const variableStatesLimit = useSelector(WorkspaceV2.active.variableStatesLimitSelector);

  const createModal = ModalsV2.useModal(ModalsV2.VariableStates.Create);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);

  return usePlanLimitedAction({
    type: LimitType.VARIABLE_STATES,
    limit: variableStatesLimit ?? 1,
    value: variableStates.length,
    onAction: () => createModal.open(),
    onLimited: (limit) => upgradeModal.openVoid(limit.upgradeModal),
  });
};
