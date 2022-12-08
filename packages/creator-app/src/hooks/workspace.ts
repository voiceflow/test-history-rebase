import { LimitType } from '@/config/planLimitV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePaymentModal, useUpgradeModal } from '@/ModalsV2/hooks';

import { usePlanLimited } from './planLimitV2';
import { useSelector } from './redux';

export const useActiveWorkspace = () => useSelector(WorkspaceV2.active.workspaceSelector);

export const useOnAddSeats = () => {
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);

  const limit = usePlanLimited({ type: LimitType.EDITOR_SEATS, limit: numberOfSeats ?? 1, value: usedEditorSeats });

  const paymentModal = usePaymentModal();
  const upgradeModal = useUpgradeModal();

  return (newSeats?: number) => {
    if (!limit?.increasableLimit || limit.increasableLimit > (newSeats ?? usedEditorSeats)) {
      paymentModal.open({});
    } else {
      upgradeModal.open(limit.upgradeModal);
    }
  };
};
