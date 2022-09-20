import { getVariableStatesPlanLimitDetails } from '@/config/planLimits/variableStates';
import { ModalType } from '@/constants';
import { UpgradePrompt } from '@/ducks/tracking';
import * as VariableState from '@/ducks/variableState';
import * as WorkspaceV2 from '@/ducks/workspaceV2';

import { useModals } from './modals';
import { useSelector } from './redux';
import { useTrackingEvents } from './tracking';

type PlanLimitHandler = (planAction: () => Promise<void>) => () => void;

export const useVariableStatesPlanLimit = (): PlanLimitHandler => {
  const variableStatesLimit = useSelector(WorkspaceV2.active.variableStatesLimitSelector);
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const LimitDetails = plan && getVariableStatesPlanLimitDetails(plan);
  const { open: openVariableStateLimitModal } = useModals(ModalType.UPGRADE_MODAL);
  const [trackingEvents] = useTrackingEvents();

  return (planAction: () => Promise<void>) => () => {
    if (variableStatesLimit && variableStates.length >= variableStatesLimit) {
      trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.VARIABLE_STATES_LIMIT });
      openVariableStateLimitModal({ planLimitDetails: LimitDetails, promptOrigin: UpgradePrompt.VARIABLE_STATES_LIMIT });
      return;
    }

    planAction();
  };
};
