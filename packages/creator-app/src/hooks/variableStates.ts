import { LimitType } from '@/config/planLimitV2';
import * as VariableState from '@/ducks/variableState';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useCreateVariableStateModal, useUpgradeModal } from '@/ModalsV2/hooks';

import { usePlanLimitedAction } from './planLimitV2';
import { useSelector } from './redux';

export const useCreateVariableState = (): VoidFunction => {
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const variableStatesLimit = useSelector(WorkspaceV2.active.variableStatesLimitSelector);

  const createModal = useCreateVariableStateModal();
  const upgradeModal = useUpgradeModal();

  return usePlanLimitedAction({
    type: LimitType.VARIABLE_STATES,
    limit: variableStatesLimit ?? 1,
    value: variableStates.length,
    onAction: () => createModal.open(),
    onLimited: (limit) => upgradeModal.openVoid(limit.upgradeModal),
  });
};
