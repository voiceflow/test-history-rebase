import { LimitType } from '@/constants/limits';
import * as VariableState from '@/ducks/variableState';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useCreateVariableStateModal, useUpgradeModal } from '@/hooks/modal.hook';

import { usePlanLimitedAction } from './planLimitV2';
import { useSelector } from './redux';

export const useCreateVariableState = (): VoidFunction => {
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const variableStatesLimit = useSelector(WorkspaceV2.active.variableStatesLimitSelector);

  const createModal = useCreateVariableStateModal();
  const upgradeModal = useUpgradeModal();

  return usePlanLimitedAction(LimitType.VARIABLE_STATES, {
    limit: variableStatesLimit ?? 1,
    value: variableStates.length,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal(config.payload)),
    onAction: () => createModal.open(),
  });
};
