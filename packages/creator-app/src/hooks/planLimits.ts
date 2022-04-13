import { ModalType } from '@/constants';
import * as VariableState from '@/ducks/variableState';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useModals, useSelector } from '@/hooks';

type PlanLimitHandler = (planAction: () => void) => () => void;

// eslint-disable-next-line import/prefer-default-export
export const useVariableStatesPlanLimit = (): PlanLimitHandler => {
  const variableStatesLimit = useSelector(WorkspaceV2.active.variableStatesLimitSelector);
  const variableStates = useSelector(VariableState.allVariableStatesSelector);

  const { open: openVariableStateLimitModal } = useModals(ModalType.VARIABLE_STATES_LIMIT_MODAL);

  return (planAction: () => void) => () => {
    if (variableStatesLimit && variableStates.length >= variableStatesLimit) {
      openVariableStateLimitModal();
      return;
    }

    planAction();
  };
};
