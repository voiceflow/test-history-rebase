import { LimitType } from '@/constants/limits';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useAddSeatsModal, usePaymentModal, useUpgradeModal } from '@/ModalsV2/hooks';

import { useGetPlanLimitedConfig } from './planLimitV2';
import { useSelector } from './redux';

export const useActiveWorkspace = () => useSelector(WorkspaceV2.active.workspaceSelector);

export const useOnAddSeats = () => {
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const isPaid = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const isOnProTrial = useSelector(WorkspaceV2.active.isOnProTrialSelector);

  const getLimitConfig = useGetPlanLimitedConfig(LimitType.EDITOR_SEATS, { limit: numberOfSeats });

  const paymentModal = usePaymentModal();
  const addSeatsModal = useAddSeatsModal();
  const upgradeModal = useUpgradeModal();

  return (newSeats?: number) => {
    const limitConfig = getLimitConfig({
      value: newSeats ?? usedEditorSeats,
      greaterOnly: Number.isFinite(newSeats) && usedEditorSeats !== newSeats,
    });

    if (!limitConfig?.increasableLimit || limitConfig.increasableLimit > (newSeats ?? usedEditorSeats)) {
      if (!isPaid || isOnProTrial) {
        addSeatsModal.open({});
        return;
      }
      paymentModal.open({});
    } else {
      upgradeModal.open(limitConfig.upgradeModal(limitConfig.payload));
    }
  };
};
